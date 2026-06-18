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
      className={`w-full max-w-4xl mx-auto px-4 pb-20 pt-6 transition-all duration-300 ${
        isSeasonalPrimal ? 'relative min-h-[580px] flex flex-col justify-between' : ''
      }`}
    >
      {/* Elegantly styled Gesture Swipe HUD Overlay */}
      <AnimatePresence>
        {swipeProgress && swipeProgress.percent > 5 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-950/85 backdrop-blur-md px-6 py-3 border border-slate-800 rounded-2xl shadow-2xl flex flex-col items-center space-y-2 pointer-events-none min-w-[220px]"
            style={{
              borderColor: `${term.themeColor}50`,
              boxShadow: `0 10px 30px -10px ${term.themeColor}33`,
            }}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 animate-spin text-amber-400" />
              <span className="text-[11px] sm:text-xs font-serif font-black tracking-wider text-slate-150">
                {swipeProgress.direction === 'left' ? (
                  currentPage === 4 ? "👉 手指左划 • 完成阅章返回日晷" : "👉 手指左划 • 翻阅下一卷"
                ) : (
                  currentPage === 1 ? "👈 手指右划 • 返回天地日晷" : "👈 手指右划 • 回溯上一卷"
                )}
              </span>
            </div>
            
            {/* Elegant visual progress bar mapping to 40% requirement */}
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full transition-all duration-75 rounded-full"
                style={{ 
                  width: `${swipeProgress.percent}%`,
                  backgroundColor: term.themeColor,
                }}
              />
            </div>
            
            <div className="flex justify-between w-full text-[9px] font-mono tracking-widest text-slate-500 font-bold uppercase gap-4 col-span-2">
              <span>起划</span>
              <span style={{ color: swipeProgress.percent >= 100 ? term.themeColor : '#64748b' }}>
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
        <div className="mb-8 bg-slate-900/60 backdrop-blur border border-slate-800 rounded-3xl p-3 sm:p-4 flex justify-between items-center relative overflow-hidden select-none">
          {/* Decorative thin pipeline background */}
          <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-slate-800 -translate-y-1/2 hidden sm:block pointer-events-none" />

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
                    backgroundColor: isActive ? term.themeColor : 'rgba(15,23,42,0.9)',
                    borderColor: isActive ? term.themeColor : isPassed ? `${term.themeColor}dd` : '#1e293b',
                    color: isActive ? '#0f172a' : isPassed ? term.themeColor : '#55657e'
                  }}
                >
                  0{step.num}
                </div>
                <div className="text-center sm:text-left">
                  <div className={`text-[11px] sm:text-xs font-serif font-bold transition-colors ${isActive ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {step.label}
                  </div>
                  <div className="text-[9px] text-slate-500 font-sans hidden sm:block">
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
            className="relative rounded-3xl border border-slate-800/40 overflow-hidden bg-slate-950/80 p-8 sm:p-12 shadow-2xl min-h-[500px] flex items-center justify-center"
            style={{
              boxShadow: `0 20px 50px -12px ${term.themeColor}22`,
            }}
          >
            {/* Seasonal Atmospheric Particles Canvas Background */}
            <SeasonalAtmosphericCanvas 
              handPointer={handPointer} 
              season={term.season}
              termColor={term.themeColor}
            />

            {/* Floating Back to Sundial trigger for UX navigation path */}
            <div className="absolute top-6 left-6 z-20">
              <button
                onClick={onBack}
                className="px-4 py-2 border border-slate-800 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/40 backdrop-blur hover:bg-slate-900/80 transition-all flex items-center gap-1.5 cursor-pointer"
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
              
              {/* Big typography centered term name */}
              <h1 className="text-7xl sm:text-9xl font-serif font-black tracking-widest bg-gradient-to-b from-white via-slate-150 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(255,255,255,0.1)] select-none">
                {term.name}
              </h1>

              {/* Subtitle credentials */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-lg font-mono italic tracking-normal font-semibold" style={{ color: term.themeColor }}>{term.pinyin}</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: term.themeColor }} />
                <span className="text-sm text-slate-400 tracking-wide font-medium">{term.dates}</span>
              </div>

              <div className="mt-12 flex flex-col items-center gap-2">
                <div className="text-[10px] sm:text-[11px] font-mono flex items-center gap-1.5 animate-pulse" style={{ color: `${term.themeColor}dd` }}>
                  <span>{seasonPrimalGuides[term.season]}</span>
                </div>
                <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 2 && (
          <motion.div
            key="pentads-page"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-4"
          >
            {/* Header description - kept ultra-compact */}
            <div className="text-center max-w-xl mx-auto mb-2 select-none">
              <h2 className="text-sm sm:text-base font-serif font-black text-slate-100 tracking-wide flex items-center justify-center gap-2">
                <span className="w-1.5 h-3.5 rounded-full animate-pulse" style={{ backgroundColor: term.themeColor }} />
                物候三候候应 / THE THREE PENTADS
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-450 mt-1 font-sans">
                五日为一候，动静成律，一窥天人合一之自然演替与物候密码
              </p>
            </div>

            {/* 3-column beautiful visual card grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {term.threePhases.map((phase, idx) => {
                const [heading, body] = phase.split(' (');
                const bodyCleaned = body ? body.slice(0, -1) : '';

                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/45 hover:bg-slate-950/60 hover:border-slate-700/60 transition-all duration-300 flex flex-col shadow-lg"
                  >
                    {/* Visual Illustration Image with Referrer Policy and Zoom Hover Effect */}
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950 select-none">
                      <img 
                        src={`https://picsum.photos/seed/${term.pinyin}-pt-${idx + 1}/400/250`} 
                        alt={heading}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-slate-900/30 to-transparent" />
                      
                      {/* Floating Indicator */}
                      <span 
                        className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border"
                        style={{ 
                          backgroundColor: `${term.themeColor}20`, 
                          borderColor: `${term.themeColor}40`, 
                          color: term.themeColor 
                        }}
                      >
                        {idx === 0 ? '初候' : idx === 1 ? '二候' : '三候'}
                      </span>
                    </div>

                    {/* Content Section */}
                    <div className="p-3.5 flex flex-col flex-grow justify-between min-h-[95px]">
                      <div>
                        <h4 className="text-xs sm:text-sm font-serif font-black text-slate-100 group-hover:text-amber-400 transition-colors">
                          {heading}
                        </h4>
                        {bodyCleaned && (
                          <p className="text-[10px] sm:text-xs text-slate-400 mt-1.5 leading-relaxed font-sans line-clamp-2">
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
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-4"
          >
            {/* 2-Part Modular Visual Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5 items-stretch">
              
              {/* 1. Traditional Customs Card */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col shadow-lg">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 select-none">
                  <img 
                    src={`https://picsum.photos/seed/${term.pinyin}-custom/400/250`} 
                    alt="Traditional Customs"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-slate-900/30 to-transparent" />
                  
                  <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[9px] font-serif font-extrabold px-2 py-0.5 rounded-full bg-slate-950/70 border border-slate-800 text-slate-150">
                    <Sun className="w-3 h-3 text-amber-400" />
                    风物岁俗
                  </span>
                </div>

                <div className="p-3.5 space-y-2.5 flex-grow">
                  <h3 className="text-[10px] font-serif font-black tracking-widest text-slate-450 uppercase">
                    时常岁事旧俗
                  </h3>
                  <div className="space-y-2">
                    {term.customs.slice(0, 2).map((custom, index) => {
                      const [primary, meaning] = custom.split(' (');
                      const cleanMeaning = meaning ? meaning.slice(0, -1) : '';
                      return (
                        <div key={index} className="text-[11px] leading-relaxed">
                          <div className="font-bold text-slate-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: term.themeColor }} />
                            {primary}
                          </div>
                          {cleanMeaning && (
                            <p className="text-[10px] text-slate-400 pl-2.5 mt-0.5 leading-snug line-clamp-1">
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
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden flex flex-col shadow-lg">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 select-none">
                  <img 
                    src={`https://picsum.photos/seed/${term.pinyin}-wellness/400/250`} 
                    alt="Wellness Advice"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-955 via-slate-900/30 to-transparent" />
                  
                  <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[9px] font-serif font-extrabold px-2 py-0.5 rounded-full bg-slate-950/70 border border-slate-800 text-slate-150">
                    <Heart className="w-3 h-3 text-rose-400 animate-pulse" />
                    医食养生
                  </span>
                </div>

                <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-serif font-black tracking-widest text-slate-450 uppercase">
                      岁时调和食理
                    </h3>
                    <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed font-sans mt-2.5 line-clamp-4">
                      {term.recommendation}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {currentPage === 4 && (
          <motion.div
            key="poetry-showcase-page"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-4"
          >
            {/* Split layout: elegant calligraphy card and illustration */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-stretch bg-slate-950/40 border border-slate-800 rounded-3xl overflow-hidden p-1.5 shadow-2xl">
              
              {/* Left side: Artwork block (2 columns) */}
              <div className="md:col-span-2 relative min-h-[160px] sm:min-h-[220px] rounded-2xl overflow-hidden bg-slate-950 select-none">
                <img 
                  src={`https://picsum.photos/seed/${term.pinyin}-poetic-art/600/800`} 
                  alt={term.poetry.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-955 via-slate-955/20 to-transparent" />
                
                {/* Floating Chinese Vintage stamp overlay */}
                <div className="absolute bottom-5 left-5 text-left z-10">
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 block uppercase mb-1">Classic Poetic Citation</span>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-slate-100 tracking-wider">
                    时雨染墨，经典雅颂
                  </h3>
                  <p className="text-xs text-slate-400 font-serif italic mt-1.5">
                    一字一乾坤，一辞一春秋
                  </p>
                </div>
              </div>

              {/* Right side: Elegant Poetry parchment block (3 columns) */}
              <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between relative bg-slate-900/10 rounded-2xl border border-slate-900/40 shadow-inner">
                
                {/* Sparkle decorative borders */}
                <div className="absolute top-4 left-4 opacity-30 select-none pointer-events-none">
                  <BookOpen className="w-4 h-4" style={{ color: term.themeColor }} />
                </div>
                
                <div className="my-auto py-4 text-center">
                  {/* Poetry Title */}
                  <h2 className="text-center text-xl sm:text-2xl font-serif font-black text-slate-100 tracking-widest drop-shadow-[0_2px_10px_rgba(255,255,255,0.05)]">
                    《{term.poetry.title}》
                  </h2>
                  
                  {/* Poetry Author */}
                  <p className="text-center text-xs sm:text-sm text-slate-450 font-serif italic mt-2 flex items-center justify-center gap-1.5 select-none">
                    <span className="w-1 h-[1px] bg-slate-700" />
                    <span>{term.poetry.author}</span>
                    <span className="w-1 h-[1px] bg-slate-700" />
                  </p>

                  <div className="w-16 h-[1px] mx-auto my-5 bg-gradient-to-r from-transparent via-slate-750 to-transparent" />
                  
                  {/* Poetry Full Content with customized whitespace parsing */}
                  <p className="text-center font-serif text-sm sm:text-base text-amber-100/90 tracking-widest leading-loose whitespace-pre-line max-w-md mx-auto select-text filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                    {term.poetry.content.split('。').filter(Boolean).map(sentence => sentence + '。').join('\n')}
                  </p>
                </div>

                {/* Return direct back button beautifully embedded */}
                <div className="pt-4 border-t border-slate-900 mt-6 select-none">
                  <button
                    onClick={onBack}
                    id="back-to-sundial-last-page"
                    className="w-full py-2.5 px-6 rounded-2xl text-xs font-bold font-serif transition-all duration-300 flex items-center justify-center space-x-1.5 border cursor-pointer hover:scale-[1.01] hover:brightness-110 active:scale-98 shadow-md"
                    style={{
                      backgroundColor: `${term.themeColor}12`,
                      borderColor: `${term.themeColor}50`,
                      color: term.themeColor,
                      boxShadow: `0 8px 25px -8px ${term.themeColor}15`
                    }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <div className="flex flex-col items-center">
                      <span>完成阅章 • 返回天地日晷</span>
                      <span className="text-[9px] opacity-60 font-sans tracking-wide mt-0.5 font-normal">(或可通过 手指左划 触发返回)</span>
                    </div>
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Navigation bar for step progress (not shown or replaced dynamically on Page 4 bottom) */}
      {currentPage < 4 && !isSeasonalPrimal && (
        <div className="mt-8 flex justify-between items-center bg-slate-900/40 p-4 border border-slate-800 rounded-2xl backdrop-blur-sm select-none">
          <div>
            {currentPage > 1 ? (
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-slate-950/60 hover:bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-medium flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <span>← 上一卷</span>
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>
          
          <div className="text-[10px] text-slate-500 font-mono tracking-widest text-center">
            {currentPage === 1 ? "一卷 · 节气概览" : currentPage === 2 ? "二卷 · 物候征候" : "三卷 · 时令民风"}
          </div>

          <div>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-5 py-2 hover:brightness-110 rounded-xl text-xs font-bold font-serif flex items-center space-x-1.5 text-slate-950 transition-all cursor-pointer shadow-md"
              style={{ backgroundColor: term.themeColor }}
            >
              <span>下一卷 →</span>
            </button>
          </div>
        </div>
      )}

    </motion.div>
  );
}
