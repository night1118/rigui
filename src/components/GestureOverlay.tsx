import React, { useEffect, useRef, useState } from 'react';
import { HandData } from './HandTracker';

interface GestureOverlayProps {
  handPointer: HandData | null;
  termColor: string;
}

export default function GestureOverlay({ handPointer, termColor }: GestureOverlayProps) {
  const [coords, setCoords] = useState({ x: -100, y: -100 });
  const [isBent, setIsBent] = useState(false);
  const [hoveredElementLabel, setHoveredElementLabel] = useState<string | null>(null);
  const [dwellProgress, setDwellProgress] = useState(0);
  const [showClickRipple, setShowClickRipple] = useState(false);
  const [rippleCoords, setRippleCoords] = useState({ x: 0, y: 0 });

  const lastTargetRef = useRef<HTMLElement | null>(null);
  const hoverStartTimeRef = useRef<number | null>(null);
  const prevBentRef = useRef<boolean>(false);
  const lastClickedTimeRef = useRef<number>(0);

  // Helper to find clickable ancestor
  const findClickableAncestor = (el: HTMLElement | null): HTMLElement | null => {
    let curr = el;
    while (curr && curr !== document.body) {
      if (
        curr.tagName === 'BUTTON' ||
        curr.tagName === 'A' ||
        curr.onclick ||
        curr.getAttribute('role') === 'button' ||
        curr.classList.contains('cursor-pointer') ||
        curr.id === 'sundial-plate-frame'
      ) {
        return curr;
      }
      curr = curr.parentElement;
    }
    return null;
  };

  // Helper to extract a human-readable name of the button/tab
  const getElementLabel = (el: HTMLElement): string => {
    if (el.id === 'sundial-plate-frame') return '天地日晷盘';
    const text = (el.innerText || el.textContent || '').trim();
    if (text) {
      // Limit size
      return text.substring(0, 10) + (text.length > 10 ? '...' : '');
    }
    const ariaLabel = el.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    
    // Find desc
    const svg = el.querySelector('svg');
    if (svg) {
      const cls = svg.getAttribute('class') || '';
      if (cls.includes('ArrowLeft')) return '返回';
      if (cls.includes('Compass')) return '罗盘';
    }
    return '按钮';
  };

  useEffect(() => {
    if (!handPointer || !handPointer.isActive) {
      setHoveredElementLabel(null);
      setDwellProgress(0);
      return;
    }

    const xPx = handPointer.x * window.innerWidth;
    const yPx = handPointer.y * window.innerHeight;
    setCoords({ x: xPx, y: yPx });
    setIsBent(handPointer.isBent);

    // Find element under hand tracker cursor
    const elementAtPoint = document.elementFromPoint(xPx, yPx) as HTMLElement | null;
    const clickable = findClickableAncestor(elementAtPoint);

    // Play click trigger on folding/bending transition
    const now = Date.now();
    if (handPointer.isBent && !prevBentRef.current && (now - lastClickedTimeRef.current > 400)) {
      if (clickable) {
        setRippleCoords({ x: xPx, y: yPx });
        setShowClickRipple(true);
        setTimeout(() => setShowClickRipple(false), 600);
        
        // Trigger virtual click!
        clickable.click();
        lastClickedTimeRef.current = now;
        
        // Reset dwell state
        hoverStartTimeRef.current = null;
        setDwellProgress(0);
      }
    }
    prevBentRef.current = handPointer.isBent;

    // Handle hover dwell-click logic
    if (clickable) {
      const label = getElementLabel(clickable);
      const isSundial = clickable.id === 'sundial-plate-frame';

      setHoveredElementLabel(label);

      if (isSundial) {
        // No hover dwell-click on the sundial plate as requested: "在日晷上不要悬停定位，只保留弯拢锁定"
        lastTargetRef.current = clickable;
        hoverStartTimeRef.current = null;
        setDwellProgress(0);
      } else {
        if (lastTargetRef.current !== clickable) {
          lastTargetRef.current = clickable;
          hoverStartTimeRef.current = now;
          setDwellProgress(0);
        } else if (hoverStartTimeRef.current) {
          const elapsed = now - hoverStartTimeRef.current;
          const completeDuration = 1700; // Extended by 0.5s as requested ("后续悬停定位时间延长0.5s", 1.2s + 0.5s = 1.7s)
          const ratio = Math.min(elapsed / completeDuration, 1);
          setDwellProgress(ratio);

          if (elapsed >= completeDuration) {
            // Trigger virtual click!
            setRippleCoords({ x: xPx, y: yPx });
            setShowClickRipple(true);
            setTimeout(() => setShowClickRipple(false), 600);

            clickable.click();
            lastClickedTimeRef.current = now;

            // Clear hover start so it doesn't loop fire click on the same element instantly
            hoverStartTimeRef.current = null;
            setDwellProgress(0);
          }
        }
      }
    } else {
      lastTargetRef.current = null;
      hoverStartTimeRef.current = null;
      setHoveredElementLabel(null);
      setDwellProgress(0);
    }
  }, [handPointer]);

  if (!handPointer || !handPointer.isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Click Visual Waves feedback */}
      {showClickRipple && (
        <div 
          className="absolute rounded-full border-4 border-yellow-400 opacity-80 animate-ping"
          style={{
            left: `${rippleCoords.x - 40}px`,
            top: `${rippleCoords.y - 40}px`,
            width: 80,
            height: 80,
          }}
        />
      )}

      {/* Floating Pointer Cursor */}
      <div 
        className="absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
        style={{
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          transform: `translate(-50%, -50%) scale(${isBent ? 0.8 : 1})`,
        }}
      >
        {/* Glowing Center Spot */}
        <div 
          className="w-4.5 h-4.5 rounded-full shadow-lg border border-white flex items-center justify-center transition-colors"
          style={{
            backgroundColor: isBent ? '#eab308' : termColor,
            boxShadow: `0 0 16px ${termColor}`,
          }}
        >
          {isBent && <span className="text-[7px] text-slate-950 font-bold">☯</span>}
        </div>

        {/* Outer breathing circle */}
        <div 
          className="absolute inset-[-12px] rounded-full border border-dashed opacity-30 animate-spin"
          style={{
            borderColor: termColor,
            animationDuration: '6s',
          }}
        />

        {/* Hover Dwell Progress Circular Ring */}
        {dwellProgress > 0 && (
          <svg className="absolute -inset-6 w-16.5 h-16.5 transform -rotate-90 pointer-events-none">
            <circle
              cx="33"
              cy="33"
              r="26"
              stroke={`${termColor}33`}
              strokeWidth="3px"
              fill="transparent"
            />
            <circle
              cx="33"
              cy="33"
              r="26"
              stroke="#eab308"
              strokeWidth="3.5px"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 26}
              strokeDashoffset={2 * Math.PI * 26 * (1 - dwellProgress)}
            />
          </svg>
        )}

        {/* Dynamic Interactive Tooltip */}
        <div className="absolute left-1/2 top-10 -translate-x-1/2 transform bg-slate-950/90 border border-slate-800 text-slate-200 text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-lg backdrop-blur-md shadow-2xl flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: hoveredElementLabel ? '#eab308' : termColor }} />
          {hoveredElementLabel ? (
            <span>
              正对准: <strong className="text-yellow-400">{hoveredElementLabel}</strong> 
              {isBent ? ' (合指点按/弯拢锁定)' : hoveredElementLabel === '天地日晷盘' ? ' (弯拢/合指锁定)' : ` (${Math.round(dwellProgress * 100)}% 悬停对位)`}
            </span>
          ) : (
            <span className="opacity-75">悬停或合指，对准界面交互</span>
          )}
        </div>
      </div>
    </div>
  );
}
