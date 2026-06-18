import React, { useEffect, useRef, useState } from 'react';
import { Camera as CameraIcon, Check, Loader2, Sparkles, Video, AlertCircle, RefreshCw, Minimize2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface HandData {
  x: number; // 0 to 1 normalized, smoothed
  y: number; // 0 to 1 normalized, smoothed
  isBent: boolean; // whether index & middle fingers are bent/curled
  isActive: boolean;
}

interface HandTrackerProps {
  onHandUpdate: (data: HandData | null) => void;
  termColor?: string;
  isDetailsMode?: boolean;
}

export default function HandTracker({ onHandUpdate, termColor = '#3b82f6', isDetailsMode = false }: HandTrackerProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('手势相机未开启');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraInstanceRef = useRef<any>(null);
  const handsInstanceRef = useRef<any>(null);
  
  // Smoothed position tracking
  const posRef = useRef({ x: 0.5, y: 0.5 });
  const isBentRef = useRef(false);

  // Auto-minimize in details view to prevent overlaying educational text, expand in sundial view
  useEffect(() => {
    if (isDetailsMode) {
      if (isEnabled) {
        setIsMinimized(true);
      }
    } else {
      setIsMinimized(false);
    }
  }, [isDetailsMode, isEnabled]);

  // Load CDN scripts and start Tracking
  useEffect(() => {
    if (!isEnabled) {
      // Clean up if disabled
      stopCamera();
      onHandUpdate(null);
      return;
    }

    setLoading(true);
    setStatusText('加载手势识别算法...');
    setErrorMsg(null);

    // Dynamic Script Loader
    const loadScript = (src: string, id: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.id = id;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const initMediaPipe = async () => {
      try {
        // Load Camera Setup and Hands scripts
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js', 'mp-camera');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js', 'mp-hands');

        if (!(window as any).Hands || !(window as any).Camera) {
          throw new Error('算法接口未能在全局作用域初始化');
        }

        setStatusText('创建算法实例...');
        
        const HandsClass = (window as any).Hands;
        const CameraClass = (window as any).Camera;

        const hands = new HandsClass({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);
        handsInstanceRef.current = hands;

        setStatusText('请求摄像头权限...');
        if (!videoRef.current) {
          throw new Error('未就绪：视频画布节点未创建');
        }

        const camera = new CameraClass(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && handsInstanceRef.current) {
              await handsInstanceRef.current.send({ image: videoRef.current });
            }
          },
          width: 320,
          height: 240
        });

        cameraInstanceRef.current = camera;
        setStatusText('启动摄像头中...');
        await camera.start();
        
        setLoading(false);
        setStatusText('手势对轨感应中');
      } catch (err: any) {
        console.error(err);
        setErrorMsg(err.message || '开启摄像头或加载手势代码失败，请允许摄像头权限');
        setLoading(false);
        setIsEnabled(false);
      }
    };

    initMediaPipe();

    return () => {
      stopCamera();
    };
  }, [isEnabled]);

  const stopCamera = () => {
    try {
      if (cameraInstanceRef.current) {
        cameraInstanceRef.current.stop();
        cameraInstanceRef.current = null;
      }
      if (handsInstanceRef.current) {
        handsInstanceRef.current.close();
        handsInstanceRef.current = null;
      }
    } catch (e) {
      console.warn('Stop error:', e);
    }
  };

  const onResults = (results: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame onto overlay canvas
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0); // mirror
    ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      // Index and middle finger tips
      const wrist = landmarks[0];
      const indexMcp = landmarks[5];
      const indexTip = landmarks[8];
      const middleMcp = landmarks[9];
      const middleTip = landmarks[12];

      if (wrist && indexMcp && indexTip && middleMcp && middleTip) {
        // Compute finger tips average position
        const rawX = (indexTip.x + middleTip.x) / 2;
        const rawY = (indexTip.y + middleTip.y) / 2;

        // Since video is mirrored, rawX represents mirrored position.
        // Convert to right-facing screen: x goes from 0 (left) to 1 (right)
        const mirroredX = 1 - rawX; 
        const targetY = rawY;

        // Smooth output coordinates with low pass filter (0.6 delay)
        posRef.current.x = posRef.current.x * 0.6 + mirroredX * 0.4;
        posRef.current.y = posRef.current.y * 0.6 + targetY * 0.4;

        // Gesture detection (Finger Bent)
        // Hand scale: wrist to middle MCP
        const dx_ref = middleMcp.x - wrist.x;
        const dy_ref = middleMcp.y - wrist.y;
        const handScale = Math.sqrt(dx_ref * dx_ref + dy_ref * dy_ref);

        // Index tip to MCP distance
        const dx_idx = indexTip.x - indexMcp.x;
        const dy_idx = indexTip.y - indexMcp.y;
        const d_idx = Math.sqrt(dx_idx * dx_idx + dy_idx * dy_idx);

        // Middle tip to MCP distance
        const dx_mid = middleTip.x - middleMcp.x;
        const dy_mid = middleTip.y - middleMcp.y;
        const d_mid = Math.sqrt(dx_mid * dx_mid + dy_mid * dy_mid);

        // Ratios
        const r_idx = d_idx / handScale;
        const r_mid = d_mid / handScale;

        // If ratio is below threshold, the fingers are curled/bent
        const isCurrentlyBent = r_idx < 0.42 && r_mid < 0.42;
        isBentRef.current = isCurrentlyBent;

        // Provide visual indicator of cursor on raw overlay canvas
        const overlayX = posRef.current.x * canvas.width;
        const overlayY = posRef.current.y * canvas.height;

        // Outer tracking ring
        ctx.beginPath();
        ctx.arc(overlayX, overlayY, 12, 0, 2 * Math.PI);
        ctx.strokeStyle = isCurrentlyBent ? '#ff3b30' : termColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(overlayX, overlayY, 4, 0, 2 * Math.PI);
        ctx.fillStyle = isCurrentlyBent ? '#ff3b30' : '#ffffff';
        ctx.fill();

        // Pass hand update outwards
        onHandUpdate({
          x: posRef.current.x,
          y: posRef.current.y,
          isBent: isCurrentlyBent,
          isActive: true
        });
      }
    } else {
      // Hands lost from view, update state moderately or keep previous pos with lower priority
      onHandUpdate({
        x: posRef.current.x,
        y: posRef.current.y,
        isBent: false,
        isActive: false
      });
    }
  };

  return (
    <div 
      id="gesture-interaction-panel" 
      onClick={() => { if (isMinimized) setIsMinimized(false); }}
      className={`transition-all duration-500 ease-in-out select-none flex flex-col ${
        isMinimized 
          ? 'fixed bottom-6 left-6 w-16 h-16 rounded-full border-2 bg-stone-950 shadow-2xl overflow-hidden cursor-pointer z-[99] hover:scale-105 active:scale-95' 
          : 'fixed bottom-6 left-6 w-[280px] bg-stone-55/95 border border-stone-200/90 rounded-3xl p-4 shadow-2xl gap-3 z-[99]'
      }`}
      style={isMinimized ? { borderColor: termColor, boxShadow: `0 0 20px ${termColor}66` } : {
        backdropFilter: 'blur(16px)',
        boxShadow: `0 20px 48px -12px ${termColor}33`,
      }}
    >
      
      {/* Hidden video element for MediaPipe frame analysis */}
      <video
        ref={videoRef}
        playsInline
        muted
        autoPlay
        style={{ display: 'none' }}
      />

      {/* 1. MINIMIZED VIEW PREVIEW */}
      {isMinimized && isEnabled && (
        <>
          <canvas
            ref={canvasRef}
            width={320}
            height={240}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          />
          <div className="absolute inset-0 border border-current rounded-full animate-ping opacity-15" style={{ color: termColor }} />
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-stone-950 animate-pulse z-10 shadow-sm" />
          <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center z-10 rounded-full">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </>
      )}

      {isMinimized && !isEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-950 hover:bg-stone-900 transition-colors rounded-full text-slate-400 pointer-events-auto">
          <CameraIcon className="w-5 h-5 animate-pulse" />
        </div>
      )}

      {/* 2. MAXIMIZED FULL VIEW */}
      {!isMinimized && (
        <>
          {/* Small heading header */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-serif font-black text-slate-800">隔空手势控轨中心</span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsEnabled(!isEnabled); }}
                className={`px-2.5 py-0.5 text-[10px] rounded-full font-sans font-bold cursor-pointer transition-all flex items-center gap-0.5 border ${
                  isEnabled 
                    ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm' 
                    : 'bg-stone-200 text-slate-700 border-stone-300'
                }`}
              >
                {isEnabled ? <>
                  <Check className="w-2.5 h-2.5" />
                  <span>已开</span>
                </> : <>
                  <CameraIcon className="w-2.5 h-2.5" />
                  <span>开启</span>
                </>}
              </button>

              {isEnabled && (
                <button
                  type="button"
                  title="最小化面板"
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}
                  className="p-1 text-slate-500 hover:text-slate-850 hover:bg-stone-200/60 rounded-lg transition-all cursor-pointer"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Camera Video Pipeline and Overlay landmarks wrapper */}
          <div className="relative w-full aspect-video rounded-2xl bg-stone-900 border border-stone-250/80 overflow-hidden flex items-center justify-center">
            
            {/* Mirrored Canvas preview reflecting processed hand stream */}
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              className="absolute inset-0 w-full h-full object-cover z-0"
              style={{ display: isEnabled ? 'block' : 'none' }}
            />

            {/* Ambient status overlays */}
            <AnimatePresence mode="wait">
              {!isEnabled ? (
                <motion.div
                  key="camera-off"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center p-3.5 flex flex-col items-center gap-1 pointer-events-auto"
                >
                  <Video className="w-7 h-7 text-slate-600 mb-0.5 animate-pulse" />
                  <div className="text-[11px] font-serif font-black text-slate-400">探针雷达未启动</div>
                  <p className="text-[9px] text-slate-500 leading-normal max-w-[195px]">
                    伸出食指与中指在视野中浮动：移动光标。合拢弯指：对轨锁定页面！
                  </p>
                </motion.div>
              ) : loading ? (
                <motion.div
                  key="loading-frame"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center flex flex-col items-center gap-1.5"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                  <div className="text-[10px] text-stone-300 font-mono">{statusText}</div>
                </motion.div>
              ) : errorMsg ? (
                <motion.div
                  key="error-frame"
                  initial={{ opacity: 0 }}
                  className="text-center p-3 flex flex-col items-center gap-1 text-rose-500"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <div className="text-[10px] font-bold">无法访问设备</div>
                  <p className="text-[9px] leading-relaxed text-rose-400/80">{errorMsg}</p>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setIsEnabled(false); setTimeout(() => setIsEnabled(true), 200); }} 
                    className="mt-1 text-[9px] px-2 py-0.5 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-900 rounded flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>重试</span>
                  </button>
                </motion.div>
              ) : (
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-stone-950/70 border border-stone-850 text-[8px] font-mono text-emerald-400 flex items-center gap-1 animate-pulse z-10 select-none">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span>LIVE • 手势对轨中</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Guide/Status bar instruction */}
          <div className="text-[10px] leading-relaxed text-slate-500 bg-stone-200/40 p-2.5 rounded-xl border border-stone-150">
            <span className="font-bold text-slate-800">☝️ 雷达控触指南：</span>
            在前面举起<strong>食指和中指</strong>。在任意按钮上<strong>悬停 1.2 秒</strong>或<strong>两指弯拢</strong>，立即完成雷达触发点按！
          </div>
        </>
      )}

    </div>
  );
}
