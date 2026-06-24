import React, { useState } from 'react';
import { SolarTerm } from '../types';
import { Sparkles, ArrowLeft, Heart, BookOpen, Sun, Wind, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HandData } from './HandTracker';
import SeasonalAtmosphericCanvas from './SeasonalAtmosphericCanvas';

interface SolarTermDetailProps {
  term: SolarTerm;
  onBack: () => void;
  handPointer?: HandData | null;
}

const renderSeasonalScrollBg = (season: 'spring' | 'summer' | 'autumn' | 'winter', color: string) => {
  if (season === 'spring') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Soft, floating ambient color washes */}
        <div className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full bg-emerald-950/15 blur-[80px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[70%] h-[70%] rounded-full bg-pink-955/20 blur-[80px]" />
        <div className="absolute top-1/3 left-1/3 w-[50%] h-[50%] rounded-full bg-amber-955/10 blur-[100px]" />
        
        {/* Fine traditional line patterns / silhouettes */}
        {/* Elegant top-left willow leaves outline */}
        <svg viewBox="0 0 400 300" className="absolute left-0 top-0 w-80 h-60 text-emerald-800/25 opacity-45 pointer-events-none">
          <path d="M0,0 C100,50 150,150 100,250 C80,210 50,180 0,150" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M120,40 C140,80 130,120 90,140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          {/* Delicate leaves */}
          <path d="M40,25 C50,22 62,25 65,30 C58,35 46,31 40,25 Z" fill="currentColor" opacity="0.6" />
          <path d="M80,55 C95,50 105,55 106,62 C96,65 85,60 80,55 Z" fill="currentColor" opacity="0.6" />
          <path d="M102,110 C120,105 125,115 122,122 C110,125 102,118 102,110 Z" fill="currentColor" opacity="0.6" />
          <path d="M104,180 C114,195 105,210 98,208 C96,196 100,185 104,180 Z" fill="currentColor" opacity="0.6" />
        </svg>

        {/* Traditional wave clouds on the bottom right */}
        <svg viewBox="0 0 300 200" className="absolute right-0 bottom-0 w-72 h-48 text-pink-800/15 opacity-35 pointer-events-none">
          <path d="M150,150 C180,130 200,130 220,150 C240,130 260,130 280,150 C290,140 300,150 300,170 C300,190 250,200 150,200 Z" fill="currentColor" />
          <path d="M80,170 C110,150 130,150 150,170 C170,150 190,150 210,170 C220,160 230,170 230,190 C230,200 180,200 80,200 Z" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    );
  }
  if (season === 'summer') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Soft, floating warm & cool ambient color washes */}
        <div className="absolute -top-1/4 -right-1/4 w-[75%] h-[75%] rounded-full bg-cyan-955/20 blur-[90px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[70%] h-[70%] rounded-full bg-emerald-955/25 blur-[85px]" />
        <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] rounded-full bg-amber-955/10 blur-[110px]" />

        {/* Summer bamboo stalks / forest breeze outlines */}
        <svg viewBox="0 0 300 400" className="absolute right-0 top-0 w-64 h-96 text-emerald-800/20 opacity-45 pointer-events-none">
          {/* Bamboo stalks */}
          <path d="M220,400 L230,0" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M160,400 L185,0" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.7" />
          {/* Thin branches/leaves */}
          <path d="M228,240 C250,220 280,230 290,250" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M175,180 C140,170 120,180 100,200" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Bamboo leaves */}
          <path d="M280,240 C288,238 296,242 300,250 C292,248 284,245 280,240 Z" fill="currentColor" opacity="0.6" />
          <path d="M265,226 C273,222 281,224 286,230 C278,229 270,228 265,226 Z" fill="currentColor" opacity="0.6" />
        </svg>

        {/* Elegant ripples on the bottom left representing summer ponds */}
        <svg viewBox="0 0 200 150" className="absolute left-6 bottom-4 w-52 h-40 text-cyan-800/20 opacity-35 pointer-events-none">
          <ellipse cx="100" cy="110" rx="60" ry="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <ellipse cx="110" cy="120" rx="40" ry="10" fill="none" stroke="currentColor" strokeWidth="1" />
          <ellipse cx="80" cy="125" rx="25" ry="6" fill="none" stroke="currentColor" strokeWidth="0.8" />
        </svg>
      </div>
    );
  }
  if (season === 'autumn') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Rich golden-orange and deep twilight purple-brown washes */}
        <div className="absolute -bottom-1/4 -left-1/4 w-[75%] h-[75%] rounded-full bg-amber-955/25 blur-[95px]" />
        <div className="absolute -top-1/4 -right-1/4 w-[70%] h-[70%] rounded-full bg-orange-955/20 blur-[85px]" />
        <div className="absolute top-1/4 left-1/3 w-[60%] h-[60%] rounded-full bg-red-955/10 blur-[100px]" />

        {/* Beautiful falling maple leaves silhouettes */}
        <svg viewBox="0 0 300 400" className="absolute left-0 top-0 w-72 h-96 text-orange-850/20 opacity-45 pointer-events-none">
          {/* Fine branches */}
          <path d="M0,80 C80,100 120,50 160,0" fill="none" stroke="currentColor" strokeWidth="1.5" />
          {/* Leaf 1 shape */}
          <path d="M90,75 L82,88 L70,82 L73,95 L60,100 L74,105 L72,118 L83,110 L92,122 L92,108 L104,104 L93,98 L94,85 Z" fill="currentColor" opacity="0.8" />
          {/* Leaf 2 shape - smaller and shifted */}
          <path d="M140,45 L134,53 L126,50 L128,58 L118,61 L129,64 L127,72 L135,67 L141,75 L141,66 L150,63 L141,60 Z" fill="currentColor" opacity="0.6" />
        </svg>

        {/* Traditional swirling clouds of harvest */}
        <svg viewBox="0 0 300 150" className="absolute right-0 bottom-0 w-80 h-40 text-amber-700/20 opacity-35 pointer-events-none">
          <path d="M260,100 C240,80 200,80 180,100 C160,80 120,80 100,100 C80,110 50,110 50,130 C50,150 300,150 300,130 Z" fill="currentColor" />
          <path d="M200,120 C185,110 160,110 145,120 C130,110 105,110 90,120 C80,125 70,125 70,135 C70,145 230,145 230,135 Z" fill="currentColor" opacity="0.6" />
        </svg>
      </div>
    );
  }
  if (season === 'winter') {
    return (
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Soft, deep blues/slate and frosty white ambient glows */}
        <div className="absolute -top-1/4 -left-1/4 w-[70%] h-[70%] rounded-full bg-cyan-955/20 blur-[90px]" />
        <div className="absolute -bottom-1/4 -right-1/4 w-[75%] h-[75%] rounded-full bg-slate-900/40 blur-[85px]" />
        <div className="absolute top-1/4 left-1/4 w-[55%] h-[55%] rounded-full bg-blue-955/15 blur-[100px]" />

        {/* Plum blossoms silhouette (cold-loving flowers in snow) */}
        <svg viewBox="0 0 300 400" className="absolute left-0 top-0 w-64 h-96 text-slate-700/25 opacity-45 pointer-events-none">
          {/* Main trunk branch */}
          <path d="M0,320 Q80,260 120,180 T110,0" fill="none" stroke="currentColor" strokeWidth="2.5" />
          {/* Sub branches */}
          <path d="M80,240 Q130,225 150,180" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M115,140 Q160,130 180,95" fill="none" stroke="currentColor" strokeWidth="1.2" />
          
          {/* Blossoms circles */}
          <circle cx="95" cy="242" r="6" fill="#ffffff" opacity="0.4" />
          <circle cx="125" cy="210" r="5" fill="#ffffff" opacity="0.5" />
          <circle cx="152" cy="180" r="7" fill="#ffffff" opacity="0.45" />
          <circle cx="138" cy="138" r="6" fill="#ffffff" opacity="0.4" />
          <circle cx="155" cy="115" r="5.5" fill="#ffffff" opacity="0.5" />
          <circle cx="180" cy="94" r="6.5" fill="#ffffff" opacity="0.6" />
        </svg>

        {/* Traditional hexagonal snowflakes fading in corner */}
        <svg viewBox="0 0 200 200" className="absolute right-4 bottom-4 w-44 h-44 text-slate-600/20 opacity-35 pointer-events-none">
          <g transform="translate(100, 100)">
            {/* 6 axes and lines */}
            <line x1="-70" y1="0" x2="70" y2="0" stroke="currentColor" strokeWidth="1.5" />
            <line x1="0" y1="-70" x2="0" y2="70" stroke="currentColor" strokeWidth="1.5" />
            <line x1="-50" y1="-50" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" />
            <line x1="-50" y1="50" x2="50" y2="-50" stroke="currentColor" strokeWidth="1.5" />
            {/* Extra crystal details */}
            <circle cx="0" cy="0" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </g>
        </svg>
      </div>
    );
  }
  return null;
};

const getSeasonalScrollClasses = (season: 'spring' | 'summer' | 'autumn' | 'winter') => {
  switch (season) {
    case 'spring':
      return "bg-gradient-to-r from-[#fff3f5]/92 via-[#fffdfd]/96 to-[#fff3f5]/92 border-rose-300/50 shadow-[0_25px_60px_-15px_rgba(244,63,94,0.11)] text-stone-850";
    case 'summer':
      return "bg-gradient-to-r from-[#edf9f2]/92 via-[#f7fdfa]/96 to-[#edf9f2]/92 border-emerald-300/50 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.12)] text-stone-850";
    case 'autumn':
      return "bg-gradient-to-r from-[#faf6ed]/92 via-[#fbf9f4]/96 to-[#faf6ed]/92 border-amber-300/50 shadow-[0_25px_60px_-15px_rgba(245,158,11,0.14)] text-stone-850";
    case 'winter':
      return "bg-gradient-to-r from-[#f5f7fa]/92 via-[#fafbfe]/96 to-[#f5f7fa]/92 border-[#d1d5db]/50 shadow-[0_25px_60px_-15px_rgba(100,110,120,0.08)] text-stone-850";
    default:
      return "bg-[#fcfaf7] border-stone-250 shadow-xl text-stone-850";
  }
};

const getSeasonalPrimalClasses = (season: 'spring' | 'summer' | 'autumn' | 'winter') => {
  switch (season) {
    case 'spring':
      return "border-rose-300/50 bg-white/75 shadow-[0_30px_70px_-15px_rgba(244,63,94,0.12)] backdrop-blur-md text-stone-850";
    case 'summer':
      return "border-emerald-300/50 bg-white/75 shadow-[0_30px_70px_-15px_rgba(16,185,129,0.12)] backdrop-blur-md text-stone-850";
    case 'autumn':
      return "border-amber-300/50 bg-white/75 shadow-[0_30px_70px_-15px_rgba(245,158,11,0.15)] backdrop-blur-md text-stone-850";
    case 'winter':
      return "border-[#d1d5db]/55 bg-white/75 shadow-[0_30px_70px_-15px_rgba(100,110,120,0.09)] backdrop-blur-md text-stone-850";
    default:
      return "border-stone-250 bg-white/80 shadow-xl text-stone-850";
  }
};

export default function SolarTermDetail({ term, onBack, handPointer = null }: SolarTermDetailProps) {
  // Page level pagination tab state
  const [currentPage, setCurrentPage] = useState<number>(1);

  // AI Form states
  const [promptType, setPromptType] = useState<'poem' | 'wisdom' | 'custom'>('poem');
  const [userContext, setUserContext] = useState('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Call the server API endpoint for Gemini generation
  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorText('');
    setAiResponse('');

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          termName: term.name,
          promptType,
          userContext
        })
      });

      if (!res.ok) {
        throw new Error('网络请求异常，服务器未能响应您的请求');
      }

      const data = await res.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Output text
      setAiResponse(data.content);
    } catch (err: any) {
      console.error(err);
      setErrorText(err?.message || '生成气象气运发生未知错误');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-configured tag styles depending on seasons
  const seasonBadges: Record<string, string> = {
    spring: "bg-emerald-950/50 text-emerald-300 border-emerald-800/60",
    summer: "bg-amber-955/30 text-amber-300 border-amber-800/60",
    autumn: "bg-orange-950/40 text-orange-300 border-orange-900/60",
    winter: "bg-blue-950/40 text-blue-300 border-blue-900/60",
  };

  const steps = [
    { num: 1, label: "节气概览", sub: "气候起源" },
    { num: 2, label: "物候三候", sub: "七十二候" },
    { num: 3, label: "时令民俗", sub: "风物养生" },
    { num: 4, label: "经典雅颂", sub: "时令诗词" }
  ];

  const isSeasonalPrimal = currentPage === 1;

  const seasonPrimalTitles: Record<string, string> = {
    spring: "🌸 孟春生力 • 春季精细长卷 🌸",
    summer: "☀️ 盛夏流萤 • 夏季精细长卷 ☀️",
    autumn: "🍁 金秋岁盈 • 秋季精细长卷 🍁",
    winter: "❄️ 岁寒岁稔 • 冬季精细长卷 ❄️",
  };

  const seasonPrimalGuides: Record<string, string> = {
    spring: "🌸 万物复苏，春风化雨。手指往左划动（至少40%宽度）触发下一卷 🌸",
    summer: "☀️ 萤火起舞，微芒烛照。手指往左划动（至少40%宽度）触发下一卷 ☀️",
    autumn: "🍁 落叶漫天，秋高气爽。手指往左划动（至少40%宽度）触发下一卷 🍁",
    winter: "❄️ 寒流呼啸，风雪凝霜。手指往左划动（至少40%宽度）触发下一卷 ❄️",
  };

  // Real-time swipe gesture progress state for high-fidelity HUD rendering
  const [swipeProgress, setSwipeProgress] = useState<{
    percent: number;
    direction: 'left' | 'right' | null;
  } | null>(null);

  const swipeStateRef = React.useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    isTracking: false,
    lastTriggerTime: 0
  });

  React.useEffect(() => {
    if (!handPointer || !handPointer.isActive) {
      swipeStateRef.current.isTracking = false;
      setSwipeProgress(null);
      return;
    }

    const now = Date.now();
    // Cool-down period to prevent duplicate paging spam
    if (now - swipeStateRef.current.lastTriggerTime < 1800) {
      swipeStateRef.current.startX = handPointer.x;
      swipeStateRef.current.startY = handPointer.y;
      swipeStateRef.current.lastX = handPointer.x;
      swipeStateRef.current.lastY = handPointer.y;
      setSwipeProgress(null);
      return;
    }

    if (!swipeStateRef.current.isTracking) {
      swipeStateRef.current.startX = handPointer.x;
      swipeStateRef.current.startY = handPointer.y;
      swipeStateRef.current.lastX = handPointer.x;
      swipeStateRef.current.lastY = handPointer.y;
      swipeStateRef.current.isTracking = true;
      setSwipeProgress(null);
      return;
    }

    const deltaX = handPointer.x - swipeStateRef.current.startX;
    const progress = Math.abs(deltaX);
    const percent = Math.min(100, Math.floor((progress / 0.4) * 100));
    const direction: 'left' | 'right' = deltaX < 0 ? 'left' : 'right';

    // Update real-time swipe visual progress
    setSwipeProgress({
      percent,
      direction
    });

    // Check if swipe distance is at least 40% (progress >= 0.4)
    if (progress >= 0.4) {
      if (direction === 'left') {
        // Swipe left (Right to Left) -> Next Page
        if (currentPage < 4) {
          setCurrentPage(prev => prev + 1);
          swipeStateRef.current.lastTriggerTime = now;
          swipeStateRef.current.isTracking = false;
          setSwipeProgress(null);
        } else {
          // currentPage === 4, swipe left to return to sundial
          onBack();
          swipeStateRef.current.lastTriggerTime = now;
          swipeStateRef.current.isTracking = false;
          setSwipeProgress(null);
        }
      } else {
        // Swipe right (Left to Right) -> Previous Page
        if (currentPage > 1) {
          setCurrentPage(prev => prev - 1);
          swipeStateRef.current.lastTriggerTime = now;
          swipeStateRef.current.isTracking = false;
          setSwipeProgress(null);
        } else {
          // currentPage === 1, swipe right to return to sundial
          onBack();
          swipeStateRef.current.lastTriggerTime = now;
          swipeStateRef.current.isTracking = false;
          setSwipeProgress(null);
        }
      }
      return;
    }

    // Dynamic direction reversal assistance
    const currentDirection = Math.sign(handPointer.x - swipeStateRef.current.lastX);
    const startDirection = Math.sign(handPointer.x - swipeStateRef.current.startX);
    if (currentDirection !== 0 && startDirection !== 0 && currentDirection !== startDirection) {
      swipeStateRef.current.startX = handPointer.x;
    }

    swipeStateRef.current.lastX = handPointer.x;
    swipeStateRef.current.lastY = handPointer.y;
  }, [handPointer, currentPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-4xl mx-auto px-4 pb-20 pt-6 transition-all duration-300 relative overflow-hidden min-h-[580px] flex flex-col justify-between rounded-3xl"
    >
      {/* Global Seasonal Ambient Particle Flowing Background covering all details sub-pages */}
      <SeasonalAtmosphericCanvas 
        handPointer={handPointer} 
        season={term.season}
        termColor={term.themeColor}
        className="absolute inset-0 w-full h-full pointer-events-none z-[15]"
      />

      {/* Elegantly styled Gesture Swipe HUD Overlay */}
      <AnimatePresence>
        {swipeProgress && swipeProgress.percent > 5 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#fcfaf7]/95 backdrop-blur-md px-6 py-3 border border-stone-250 rounded-2xl shadow-2xl flex flex-col items-center space-y-2 pointer-events-none min-w-[220px]"
            style={{
              borderColor: `${term.themeColor}50`,
              boxShadow: `0 10px 30px -10px ${term.themeColor}33`,
            }}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              <span className="text-[11px] sm:text-xs font-serif font-black tracking-wider text-stone-850">
                {swipeProgress.direction === 'left' ? (
                  currentPage === 4 ? "👉 手指左划 • 完成阅章返回日晷" : "👉 手指左划 • 翻阅下一卷"
                ) : (
                  currentPage === 1 ? "👈 手指右划 • 返回天地日晷" : "👈 手指右划 • 回溯上一卷"
                )}
              </span>
            </div>
            
            {/* Elegant visual progress bar mapping to 40% requirement */}
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
              <div 
                className="h-full transition-all duration-75 rounded-full"
                style={{ 
                  width: `${swipeProgress.percent}%`,
                  backgroundColor: term.themeColor,
                }}
              />
            </div>
            
            <div className="flex justify-between w-full text-[9px] font-mono tracking-widest text-stone-500 font-bold uppercase gap-4 col-span-2">
              <span>起划</span>
              <span style={{ color: swipeProgress.percent >= 100 ? term.themeColor : '#78716c' }}>
                {swipeProgress.percent >= 100 ? (
                  (swipeProgress.direction === 'left' && currentPage === 4) || (swipeProgress.direction === 'right' && currentPage === 1) ? "释放返回" : "释放翻卷"
                ) : `${swipeProgress.percent}%`}
              </span>
              <span>触卷 (40% 跨度)</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* High-fidelity elegant interactive chapter tab indicators */}
      {!isSeasonalPrimal && (
        <div className="mb-8 bg-white/70 backdrop-blur border border-stone-250 rounded-3xl p-3 sm:p-4 flex justify-between items-center relative overflow-hidden select-none shadow-xs">
          {/* Decorative thin pipeline background */}
          <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-stone-200 -translate-y-1/2 hidden sm:block pointer-events-none" />

          {steps.map((step) => {
            const isActive = currentPage === step.num;
            const isPassed = currentPage > step.num;
            return (
              <button
                key={step.num}
                onClick={() => setCurrentPage(step.num)}
                className="z-10 flex flex-col sm:flex-row items-center gap-2 px-2.5 sm:px-4 py-2 rounded-2xl transition-all cursor-pointer group"
              >
                <div 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-mono text-xs font-black transition-all border"
                  style={{
                    backgroundColor: isActive ? term.themeColor : '#ffffff',
                    borderColor: isActive ? term.themeColor : isPassed ? `${term.themeColor}aa` : '#e5e7eb',
                    color: isActive ? '#ffffff' : isPassed ? term.themeColor : '#78716c'
                  }}
                >
                  0{step.num}
                </div>
                <div className="text-center sm:text-left">
                  <div className={`text-[11px] sm:text-xs font-serif font-black transition-colors ${isActive ? 'text-stone-900 font-bold' : 'text-stone-500 group-hover:text-stone-850'}`}>
                    {step.label}
                  </div>
                  <div className="text-[9px] text-stone-550 font-sans hidden sm:block">
                    {step.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Pages Content Switcher with animations */}
      <AnimatePresence mode="wait">
        {currentPage === 1 && (
          <motion.div
            key="seasonal-primal-page"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`relative rounded-3xl border overflow-hidden p-8 sm:p-12 min-h-[500px] flex items-center justify-center transition-all duration-500 ${getSeasonalPrimalClasses(term.season)}`}
            style={{
              boxShadow: `0 20px 50px -12px ${term.themeColor}22`,
            }}
          >
            {/* Floating Back to Sundial trigger for UX navigation path */}
            <div className="absolute top-6 left-6 z-20">
              <button
                onClick={onBack}
                className="px-4 py-2 border border-stone-250 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 bg-white/70 backdrop-blur hover:bg-white/95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回天地日晷</span>
              </button>
            </div>

            {/* Central text displaying Term Name centered and enlarged */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-xl select-none">
              <div 
                className="text-xs tracking-widest font-mono mb-2 uppercase animate-pulse font-bold"
                style={{ color: term.themeColor }}
              >
                {seasonPrimalTitles[term.season]}
              </div>
              
              {/* Big typography centered term name in classic ink-stone typography */}
              <h1 className="text-7xl sm:text-9xl font-serif font-black tracking-widest bg-gradient-to-b from-stone-850 via-stone-750 to-stone-900 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(28,25,23,0.06)] select-none">
                {term.name}
              </h1>

              {/* Subtitle credentials */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-lg font-mono italic tracking-normal font-semibold" style={{ color: term.themeColor }}>{term.pinyin}</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: term.themeColor }} />
                <span className="text-sm text-stone-600 tracking-wide font-semibold">{term.dates}</span>
              </div>

              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5 animate-pulse" style={{ color: `${term.themeColor}dd` }}>
                  <span>{seasonPrimalGuides[term.season]}</span>
                </div>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-stone-400 to-transparent" />
                
                {/* Switch to Next Volume Switch / Button */}
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: `0 10px 25px -5px ${term.themeColor}33` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentPage(2)}
                  className="mt-2 px-6 py-2.5 rounded-xl text-xs font-semibold font-serif flex items-center space-x-2 text-white transition-all cursor-pointer shadow-md tracking-wider"
                  style={{ backgroundColor: term.themeColor }}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>直接翻阅 · 二卷物候 →</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 2 && (
          <motion.div
            key="pentads-page"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`relative px-5 sm:px-10 py-5 sm:py-6 md:py-8 rounded-3xl border overflow-hidden transition-all duration-500 min-h-[500px] md:h-[500px] flex flex-col justify-between ${getSeasonalScrollClasses(term.season)}`}
            style={{
              boxShadow: `0 20px 50px -12px ${term.themeColor}22`,
            }}
          >
            {renderSeasonalScrollBg(term.season, term.themeColor)}
            
            {/* Left wooden cylinder scroll rod */}
            <div className="absolute left-2.5 top-0 bottom-0 w-3 bg-gradient-to-b from-[#4e3a2b] via-[#85664d] to-[#34271d] shadow-2xl flex flex-col justify-between items-center py-5 z-20 pointer-events-none">
              <div className="w-5 h-2.5 bg-gradient-to-b from-amber-700 to-amber-950 border border-amber-600/30 rounded-t shadow -mt-2" />
              <div className="w-5 h-2.5 bg-gradient-to-t from-amber-700 to-amber-950 border border-amber-600/30 rounded-b shadow -mb-2" />
            </div>

            {/* Right wooden cylinder scroll rod */}
            <div className="absolute right-2.5 top-0 bottom-0 w-3 bg-gradient-to-b from-[#4e3a2b] via-[#85664d] to-[#34271d] shadow-2xl flex flex-col justify-between items-center py-5 z-20 pointer-events-none">
              <div className="w-5 h-2.5 bg-gradient-to-b from-amber-700 to-amber-950 border border-amber-600/30 rounded-t shadow -mt-2" />
              <div className="w-5 h-2.5 bg-gradient-to-t from-amber-700 to-amber-950 border border-amber-600/30 rounded-b shadow -mb-2" />
            </div>

            {/* Fine silk mount trim lines */}
            <div className="absolute inset-y-0 left-[22px] w-[1px] bg-gradient-to-b from-transparent via-amber-600/25 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-[22px] w-[1px] bg-gradient-to-b from-transparent via-amber-600/25 to-transparent pointer-events-none z-10" />

            {/* Antique Seal Stamp Top Right */}
            <div className="absolute top-5 right-9 border-2 border-red-700/80 text-red-700/90 bg-red-50/60 px-2 py-0.5 rounded font-serif text-[9px] sm:text-[10px] font-semibold tracking-widest rotate-6 select-none pointer-events-none z-10">
              物候真诠
            </div>

            {/* Header Title on Scroll center */}
            <div className="text-center max-w-xl mx-auto mb-3 sm:mb-4 relative z-10 select-none">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-red-50/80 rounded-full border border-red-200/40 text-[9px] tracking-widest text-amber-800 font-serif mb-1 font-bold">
                <span>✨ 卷零贰 • 昭苏候应</span>
              </div>
              <h2 className="text-xs sm:text-sm font-serif font-black text-stone-850 tracking-wider flex items-center justify-center gap-1.5">
                物候三候候应 / THE THREE PENTADS
              </h2>
              <div className="w-12 h-[1px] mx-auto my-1.5 bg-amber-600/30" />
              <p className="text-[9px] sm:text-[10px] text-stone-600 font-sans leading-relaxed">
                五日为一候，动静有常。体悟天地生息与物候密码
              </p>
            </div>

            {/* Inner Parchment Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 relative z-10 flex-grow items-stretch">
              {term.threePhases.map((phase, idx) => {
                const [heading, body] = phase.split(' (');
                const bodyCleaned = body ? body.slice(0, -1) : '';

                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.12 }}
                    className="group overflow-hidden rounded-xl border border-stone-200/40 bg-white/75 backdrop-blur-xs shadow-xs hover:bg-white hover:border-amber-400/50 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Grid Image with beautifully proportioned height */}
                    <div className="relative h-20 sm:h-24 md:h-28 lg:h-32 w-full overflow-hidden bg-stone-100 select-none shrink-0 border-b border-stone-100">
                      <img 
                        src={`https://picsum.photos/seed/${term.pinyin}-pt-${idx + 1}/400/250`} 
                        alt={heading}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/10 to-transparent" />
                      
                      {/* Phase label */}
                      <span 
                        className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase tracking-wider backdrop-blur-md border shadow-xs"
                        style={{ 
                          backgroundColor: `${term.themeColor}15`, 
                          borderColor: `${term.themeColor}35`, 
                          color: term.themeColor 
                        }}
                      >
                        {idx === 0 ? '一候 • 初候' : idx === 1 ? '二候 • 中候' : '三候 • 末候'}
                      </span>
                    </div>

                    {/* Info Content inside scroll block */}
                    <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between select-text">
                      <div className="space-y-1 md:space-y-1.5">
                        <h4 className="text-xs sm:text-sm font-serif font-black text-stone-880 group-hover:text-amber-800 transition-colors leading-tight">
                          {heading}
                        </h4>
                        {bodyCleaned && (
                          <p className="text-[10px] sm:text-xs text-stone-600 leading-relaxed font-sans line-clamp-2 md:line-clamp-3">
                            {bodyCleaned}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {currentPage === 3 && (
          <motion.div
            key="customs-page"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`relative px-5 sm:px-10 py-5 sm:py-6 md:py-8 rounded-3xl border overflow-hidden transition-all duration-500 min-h-[500px] md:h-[500px] flex flex-col justify-between ${getSeasonalScrollClasses(term.season)}`}
            style={{
              boxShadow: `0 20px 50px -12px ${term.themeColor}22`,
            }}
          >
            {renderSeasonalScrollBg(term.season, term.themeColor)}
            
            {/* Left cylinder rod */}
            <div className="absolute left-2.5 top-0 bottom-0 w-3 bg-gradient-to-b from-[#4e3a2b] via-[#85664d] to-[#34271d] shadow-2xl flex flex-col justify-between items-center py-5 z-20 pointer-events-none">
              <div className="w-5 h-2.5 bg-gradient-to-b from-amber-700 to-amber-950 border border-amber-600/30 rounded-t shadow -mt-2" />
              <div className="w-5 h-2.5 bg-gradient-to-t from-amber-700 to-amber-950 border border-amber-600/30 rounded-b shadow -mb-2" />
            </div>

            {/* Right cylinder rod */}
            <div className="absolute right-2.5 top-0 bottom-0 w-3 bg-gradient-to-b from-[#4e3a2b] via-[#85664d] to-[#34271d] shadow-2xl flex flex-col justify-between items-center py-5 z-20 pointer-events-none">
              <div className="w-5 h-2.5 bg-gradient-to-b from-amber-700 to-amber-950 border border-amber-600/30 rounded-t shadow -mt-2" />
              <div className="w-5 h-2.5 bg-gradient-to-t from-amber-700 to-amber-950 border border-amber-600/30 rounded-b shadow -mb-2" />
            </div>

            <div className="absolute inset-y-0 left-[22px] w-[1px] bg-gradient-to-b from-transparent via-amber-600/25 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-[22px] w-[1px] bg-gradient-to-b from-transparent via-amber-600/25 to-transparent pointer-events-none z-10" />

            {/* Seal stamps */}
            <div className="absolute top-5 right-9 border-2 border-red-600/80 text-red-700 bg-red-50/60 px-2 py-0.5 rounded font-serif text-[9px] sm:text-[10px] font-semibold -rotate-3 select-none pointer-events-none z-10">
              时令民风
            </div>

            {/* Header Title */}
            <div className="text-center max-w-xl mx-auto mb-3 sm:mb-4 relative z-10 select-none">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-red-50/80 rounded-full border border-red-200/40 text-[9px] tracking-widest text-amber-800 font-serif mb-1 font-bold">
                <span>✨ 卷零叁 • 时令风物</span>
              </div>
              <h2 className="text-xs sm:text-sm font-serif font-black text-stone-850 tracking-wider flex items-center justify-center gap-1.5">
                时令民俗风物 / SEASONAL CUSTOMS
              </h2>
              <div className="w-12 h-[1px] mx-auto my-1.5 bg-amber-600/30" />
              <p className="text-[9px] sm:text-[10px] text-stone-600 font-sans leading-relaxed">
                岁时节物，承载华夏旧俗温情与养生之理
              </p>
            </div>

            {/* Bento Grid layout with absolute screen fitting height limit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 flex-grow items-stretch">
              
              {/* 1. Traditional Customs Card */}
              <div className="bg-white/75 border border-stone-200/40 rounded-xl overflow-hidden flex flex-col shadow-xs justify-between h-full hover:border-amber-400/40 transition-all duration-300">
                <div className="relative h-20 sm:h-24 md:h-28 lg:h-32 w-full overflow-hidden bg-stone-100 select-none shrink-0 border-b border-stone-100">
                  <img 
                    src={`https://picsum.photos/seed/${term.pinyin}-custom/500/300`} 
                    alt="Traditional Customs"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/10 to-transparent" />
                  
                  <span className="absolute top-1.5 left-1.5 flex items-center gap-1 text-[8px] font-serif font-extrabold px-1.5 py-0.5 rounded-full bg-white/90 border border-stone-200 text-stone-700 shadow-xs">
                    <Sun className="w-2.5 h-2.5 text-amber-500" />
                    时时节俗
                  </span>
                </div>

                <div className="p-3 md:p-4 space-y-1.5 sm:space-y-2 flex-grow flex flex-col justify-center select-text">
                  <h3 className="text-[9px] font-serif font-black tracking-widest text-amber-850 uppercase">
                    时令民俗事象
                  </h3>
                  <div className="space-y-2 md:space-y-2.5">
                    {term.customs.slice(0, 2).map((custom, index) => {
                      const [primary, meaning] = custom.split(' (');
                      const cleanMeaning = meaning ? meaning.slice(0, -1) : '';
                      return (
                        <div key={index} className="text-xs leading-relaxed">
                          <div className="font-bold text-stone-850 flex items-center gap-1.5 font-serif">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: term.themeColor }} />
                            {primary}
                          </div>
                          {cleanMeaning && (
                            <p className="text-[10px] sm:text-xs text-stone-600 pl-3 leading-relaxed line-clamp-1 sm:line-clamp-2 mt-0.5">
                              {cleanMeaning}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. Wellness Diet Card */}
              <div className="bg-white/75 border border-stone-200/40 rounded-xl overflow-hidden flex flex-col shadow-xs justify-between h-full hover:border-rose-400/40 transition-all duration-300">
                <div className="relative h-20 sm:h-24 md:h-28 lg:h-32 w-full overflow-hidden bg-stone-100 select-none shrink-0 border-b border-stone-100">
                  <img 
                    src={`https://picsum.photos/seed/${term.pinyin}-wellness/500/300`} 
                    alt="Wellness Advice"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-85 transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/10 to-transparent" />
                  
                  <span className="absolute top-1.5 left-1.5 flex items-center gap-1 text-[8px] font-serif font-extrabold px-1.5 py-0.5 rounded-full bg-white/90 border border-stone-200 text-stone-700 shadow-xs">
                    <Heart className="w-2.5 h-2.5 text-rose-500" />
                    食医养生
                  </span>
                </div>

                <div className="p-3 md:p-4 space-y-1.5 sm:space-y-2 flex-grow flex flex-col justify-center select-text">
                  <h3 className="text-[9px] font-serif font-black tracking-widest text-rose-800 uppercase">
                    调和食气之理
                  </h3>
                  <p className="text-[11px] sm:text-xs text-stone-700 leading-relaxed font-sans line-clamp-3 sm:line-clamp-4">
                    {term.recommendation}
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {currentPage === 4 && (
          <motion.div
            key="poetry-showcase-page"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className={`relative px-5 sm:px-10 py-5 sm:py-6 md:py-8 rounded-3xl border overflow-hidden transition-all duration-500 min-h-[500px] md:h-[500px] flex flex-col justify-between ${getSeasonalScrollClasses(term.season)}`}
            style={{
              boxShadow: `0 20px 50px -12px ${term.themeColor}22`,
            }}
          >
            {renderSeasonalScrollBg(term.season, term.themeColor)}
            
            {/* Left wooden cylinder scroll rod */}
            <div className="absolute left-2.5 top-0 bottom-0 w-3 bg-gradient-to-b from-[#4e3a2b] via-[#85664d] to-[#34271d] shadow-2xl flex flex-col justify-between items-center py-5 z-20 pointer-events-none">
              <div className="w-5 h-2.5 bg-gradient-to-b from-amber-700 to-amber-950 border border-amber-600/30 rounded-t shadow -mt-2" />
              <div className="w-5 h-2.5 bg-gradient-to-t from-amber-700 to-amber-950 border border-amber-600/30 rounded-b shadow -mb-2" />
            </div>

            {/* Right wooden cylinder scroll rod */}
            <div className="absolute right-2.5 top-0 bottom-0 w-3 bg-gradient-to-b from-[#4e3a2b] via-[#85664d] to-[#34271d] shadow-2xl flex flex-col justify-between items-center py-5 z-20 pointer-events-none">
              <div className="w-5 h-2.5 bg-gradient-to-b from-amber-700 to-amber-950 border border-amber-600/30 rounded-t shadow -mt-2" />
              <div className="w-5 h-2.5 bg-gradient-to-t from-amber-700 to-amber-950 border border-amber-600/30 rounded-b shadow -mb-2" />
            </div>

            {/* Fine silk mount trim lines */}
            <div className="absolute inset-y-0 left-[22px] w-[1px] bg-gradient-to-b from-transparent via-amber-600/25 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-y-0 right-[22px] w-[1px] bg-gradient-to-b from-transparent via-amber-600/25 to-transparent pointer-events-none z-10" />

            {/* Classical Calligraphy Page Headers */}
            <div className="text-center max-w-xl mx-auto mb-3 sm:mb-4 relative z-10 select-none">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-50/80 rounded-full border border-red-200/40 text-[9px] tracking-widest text-amber-800 font-serif mb-1 font-bold">
                <span>✨ 卷零肆 • 华章雅颂</span>
              </div>
              <h2 className="text-xs sm:text-sm font-serif font-black text-stone-850 tracking-wider flex items-center justify-center gap-1.5">
                经典雅颂诗词 / IMMORTAL POETRY
              </h2>
              <div className="w-12 h-[1px] mx-auto my-1 bg-amber-500/30" />
            </div>

            {/* Unrolling handscroll layout inside - Single Full Width Classical Panel - Unified height & design */}
            <div className="relative z-10 bg-[#fcf9f2] rounded-xl border border-amber-800/15 p-4 sm:p-5 md:p-6 overflow-hidden shadow-inner flex-grow flex flex-col justify-between select-text">
              
              {/* Immersive Classical Calligraphy Canvas (Full Width) */}
              <div className="w-full flex-grow flex flex-col justify-between relative min-h-[200px] select-text">
                
                {/* Decorative Borders/Watermarks */}
                <div className="absolute top-2 left-2 opacity-15 select-none pointer-events-none z-0">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                </div>
                <div className="absolute bottom-2 right-2 opacity-15 select-none pointer-events-none z-0">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>

                {/* Red/gold mount double line frame */}
                <div className="absolute inset-0.5 sm:inset-1 border border-red-750/15 pointer-events-none" />

                {/* Poetry Container - Centered and fully legible */}
                <div className="relative z-10 flex flex-col items-center justify-center py-4 my-auto w-full select-text text-center">
                  
                  {/* Poetry Title */}
                  <h1 className="font-serif font-black text-amber-950 text-base sm:text-lg md:text-xl tracking-[0.25em] mb-1.5">
                    《{term.poetry.title}》
                  </h1>

                  {/* Author & Dynasty */}
                  <p className="font-serif text-stone-600 text-xs sm:text-sm tracking-[0.1em] mb-4 opacity-90 flex items-center gap-1.5 justify-center">
                    <span>{term.poetry.author}</span>
                  </p>

                  {/* Decorative split line */}
                  <div className="w-16 h-[1px] bg-amber-600/30 mb-4 sm:mb-5" />

                  {/* Poetry Content Lines */}
                  <div className="space-y-2 sm:space-y-3 font-serif text-stone-900 text-xs sm:text-sm md:text-base tracking-[0.15em] font-medium leading-relaxed max-w-lg mx-auto">
                    {term.poetry.content.split('\n').map((line, lIdx) => {
                      const trimmedLine = line.trim();
                      if (!trimmedLine) return null;
                      return (
                        <p key={lIdx} className="hover:text-amber-800 transition-colors duration-200">
                          {trimmedLine}
                        </p>
                      );
                    })}
                  </div>

                </div>

                {/* Return Direct Button integrated */}
                <div className="pt-2 sm:pt-3 border-t border-stone-200/50 mt-4 relative z-10 select-none">
                  <button
                    onClick={onBack}
                    id="back-to-sundial-last-page"
                    className="w-full py-2 px-4 rounded-lg text-xs font-bold font-serif transition-all duration-300 flex items-center justify-center space-x-1 border border-amber-500/25 bg-amber-50 hover:bg-amber-100 text-amber-900 hover:scale-[1.01] active:scale-98 shadow-xs cursor-pointer"
                  >
                    <ArrowLeft className="w-3" />
                    <span>阅卷完毕 • 返回日晷天地</span>
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation bar for step progress - visible on all 4 pages */}
      {!isSeasonalPrimal && (
        <div className="mt-8 flex justify-between items-center bg-white/60 p-4 border border-stone-200 rounded-2xl backdrop-blur-sm select-none shadow-xs">
          <div>
            {currentPage > 1 ? (
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-white/70 hover:bg-white border border-stone-200 text-stone-600 hover:text-stone-850 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>← 上一卷</span>
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>
          
          <div className="text-[10px] text-stone-600 font-serif tracking-widest text-center font-bold">
            {currentPage === 1 ? "一卷 · 节气概览" : currentPage === 2 ? "二卷 · 物候征候" : currentPage === 3 ? "三卷 · 时令民风" : "四卷 · 华章雅颂"}
          </div>

          <div>
            {currentPage < 4 ? (
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-5 py-2 hover:brightness-110 rounded-xl text-xs font-bold font-serif flex items-center space-x-1.5 text-white transition-all cursor-pointer shadow-md"
                style={{ backgroundColor: term.themeColor }}
              >
                <span>下一卷 →</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentPage(1)}
                className="px-5 py-2 hover:brightness-110 rounded-xl text-xs font-bold font-serif flex items-center space-x-1.5 text-white transition-all cursor-pointer shadow-md"
                style={{ backgroundColor: '#292524' }}
              >
                <span>回到首卷 ↺</span>
              </button>
            )}
          </div>
        </div>
      )}

    </motion.div>
  );
}
