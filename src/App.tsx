import React, { useState, useEffect } from 'react';
import { Season, SolarTerm, HourMapping } from './types';
import { solarTermsData, seasonsData, hoursData } from './data';
import SundialPlate from './components/SundialPlate';
import SolarTermDetail from './components/SolarTermDetail';
import HandTracker, { HandData } from './components/HandTracker';
import GestureOverlay from './components/GestureOverlay';
import { Compass, CalendarDays, BookOpen, Clock, Waves, ChevronRight, Wind, Snowflake, Flame, Sun, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const springImg = new URL('./assets/images/season_spring_1781752388171.jpg', import.meta.url).href;
const summerImg = new URL('./assets/images/season_summer_1781752400894.jpg', import.meta.url).href;
const autumnImg = new URL('./assets/images/season_autumn_1781752412470.jpg', import.meta.url).href;
const winterImg = new URL('./assets/images/season_winter_1781752421896.jpg', import.meta.url).href;

export default function App() {
  const [activeSeason, setActiveSeason] = useState<Season>('spring');
  const [selectedTerm, setSelectedTerm] = useState<SolarTerm>(solarTermsData[0]); // default 立春
  const [currentHour, setCurrentHour] = useState<HourMapping>(hoursData[6]); // default 午时
  const [isShadowFixed, setIsShadowFixed] = useState(false);
  const [viewMode, setViewMode] = useState<'sundial' | 'detail'>('sundial');
  const [handPointer, setHandPointer] = useState<HandData | null>(null);
  
  // Interactive pointer trail particles
  const [trail, setTrail] = useState<{ x: number; y: number; id: number; size: number; dx: number; dy: number }[]>([]);

  // Spawn trail on hover/drag or camera tracker movement
  useEffect(() => {
    if (viewMode !== 'sundial') return;

    const spawnParticle = (x: number, y: number) => {
      // Spawn 2 particles for a richer feeling
      const p1 = {
        x: x + (Math.random() * 16 - 8),
        y: y + (Math.random() * 16 - 8),
        id: Math.random(),
        size: Math.random() * 16 + 8, // larger and clearer particles in corners and center
        dx: Math.random() * 240 - 120, // wider horizontal swirl
        dy: Math.random() * -220 - 80,  // tall float up
      };
      const p2 = {
        x: x + (Math.random() * 16 - 8),
        y: y + (Math.random() * 16 - 8),
        id: Math.random(),
        size: Math.random() * 10 + 5,
        dx: Math.random() * 160 - 80,
        dy: Math.random() * -160 - 50,
      };

      setTrail(prev => [p1, p2, ...prev].slice(0, 60)); // keep up to 60 elements for highly responsive trails
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (handPointer && handPointer.isActive) return;
      spawnParticle(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (handPointer && handPointer.isActive) return;
      if (e.touches[0]) {
        spawnParticle(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [viewMode, handPointer]);

  // Sync handPointer updates into the particle trail system
  useEffect(() => {
    if (viewMode === 'sundial' && handPointer && handPointer.isActive) {
      const xPx = handPointer.x * window.innerWidth;
      const yPx = handPointer.y * window.innerHeight;
      
      const p1 = {
        x: xPx + (Math.random() * 10 - 5),
        y: yPx + (Math.random() * 10 - 5),
        id: Math.random(),
        size: Math.random() * 20 + 8, // Extra large for hand recognition to look beautiful
        dx: Math.random() * 300 - 150,
        dy: Math.random() * -250 - 100,
      };
      
      setTrail(prev => [p1, ...prev].slice(0, 60));
    }
  }, [handPointer, viewMode]);

  // Sync active season with selectedTerm season changes (from sundial tracking)
  const handleTermSelectedFromSundial = (term: SolarTerm) => {
    setSelectedTerm(term);
  };

  // Switch season explicitly
  const handleSeasonChange = (season: Season) => {
    setActiveSeason(season);
    setIsShadowFixed(false);
    // Find the first term of that season
    const firstTermOfSeason = solarTermsData.find(t => t.season === season);
    if (firstTermOfSeason) {
      setSelectedTerm(firstTermOfSeason);
    }
  };

  // Render a clean CSS background/particle system based on active season
  const renderBackgroundParticles = () => {
    const particlesCount = 48;
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {Array.from({ length: particlesCount }).map((_, i) => {
          const size = Math.random() * 12 + 4;
          const left = Math.random() * 100;
          const delay = Math.random() * 15;
          const duration = Math.random() * 20 + 15;
          
          let content: React.ReactNode = null;
          
          if (activeSeason === 'spring') {
            // Sakura blossom petal
            content = (
              <div 
                className="w-full h-full rounded-full opacity-40 bg-pink-300"
                style={{ borderRadius: '50% 0 50% 50%', transform: `rotate(${Math.random() * 360}deg)` }}
              />
            );
          } else if (activeSeason === 'summer') {
            // Glowing Firefly / Sun particle
            content = (
              <div className="w-full h-full rounded-full opacity-20 bg-yellow-400 blur-[2px] shadow-[0_0_8px_#f59e0b]" />
            );
          } else if (activeSeason === 'autumn') {
            // Fall Ginkgo dry leaf / Golden wind speckle
            content = (
              <div 
                className="w-full h-full opacity-35 bg-amber-600 rounded-sm"
                style={{ transform: `skewX(${Math.random() * 40}deg) rotate(${Math.random() * 360}deg)` }}
              />
            );
          } else {
            // Snowflake crystal
            content = (
              <Snowflake className="w-full h-full opacity-30 text-blue-200" />
            );
          }

          return (
            <div
              key={i}
              className="absolute top-[-20px] animate-fall pointer-events-none"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${left}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
              }}
            >
              {content}
            </div>
          );
        })}
      </div>
    );
  };

  // Render highly responsive theme-colored trails following gesture movements
  const renderInteractiveTrail = () => {
    if (viewMode !== 'sundial') return null;
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
        {trail.map(p => {
          let content: React.ReactNode = null;
          if (activeSeason === 'spring') {
            content = (
              <div 
                className="w-full h-full rounded-full opacity-80 bg-pink-400 shadow-[0_0_6px_#f472b6]"
                style={{ borderRadius: '50% 0 50% 50%', transform: `rotate(${Math.random() * 360}deg)` }}
              />
            );
          } else if (activeSeason === 'summer') {
            content = (
              <div className="w-full h-full rounded-full bg-yellow-400 shadow-[0_0_12px_#f59e0b] blur-[0.5px]" />
            );
          } else if (activeSeason === 'autumn') {
            content = (
              <div 
                className="w-full h-full bg-amber-500 rounded-sm shadow-[0_0_6px_#d97706]"
                style={{ transform: `skewX(12deg) rotate(${Math.random() * 365}deg)` }}
              />
            );
          } else {
            content = (
              <Snowflake className="w-full h-full text-blue-300 drop-shadow-[0_0_4px_rgba(147,197,253,0.9)]" />
            );
          }

          return (
            <div
              key={p.id}
              className="absolute pointer-events-none"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                transform: 'translate(-50%, -50%)',
                animation: 'particleFloat 1.0s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
              } as React.CSSProperties}
            >
              {content}
            </div>
          );
        })}
      </div>
    );
  };

  // Dynamic aesthetic class names mapping for backgrounds and headers
  const seasonStyles: Record<Season, {
    textColor: string,
    accentTextColor: string,
    badgeColor: string,
    buttonStyle: string,
    glowBg: string,
    titleGlow: string
  }> = {
    spring: {
      textColor: 'text-emerald-400',
      accentTextColor: 'text-emerald-500',
      badgeColor: 'bg-emerald-950/50 border-emerald-900/60 text-emerald-300',
      buttonStyle: 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-900/30 text-emerald-950',
      glowBg: 'from-emerald-950/20 via-slate-900/90 to-slate-950',
      titleGlow: 'shadow-emerald-500/20'
    },
    summer: {
      textColor: 'text-amber-400',
      accentTextColor: 'text-amber-500',
      badgeColor: 'bg-amber-950/50 border-amber-900/60 text-amber-300',
      buttonStyle: 'bg-amber-500 hover:bg-amber-400 hover:shadow-amber-900/30 text-amber-950',
      glowBg: 'from-amber-950/15 via-slate-900/90 to-slate-950',
      titleGlow: 'shadow-amber-500/20'
    },
    autumn: {
      textColor: 'text-orange-400',
      accentTextColor: 'text-orange-500',
      badgeColor: 'bg-orange-950/50 border-orange-900/60 text-orange-350',
      buttonStyle: 'bg-orange-600 hover:bg-orange-500 hover:shadow-orange-900/30 text-orange-950',
      glowBg: 'from-orange-950/15 via-slate-900/90 to-slate-950',
      titleGlow: 'shadow-orange-500/20'
    },
    winter: {
      textColor: 'text-blue-400',
      accentTextColor: 'text-blue-500',
      badgeColor: 'bg-blue-950/50 border-blue-900/60 text-blue-300',
      buttonStyle: 'bg-blue-600 hover:bg-blue-500 hover:shadow-blue-900/30 text-blue-950',
      glowBg: 'from-blue-950/20 via-slate-900/90 to-slate-950',
      titleGlow: 'shadow-blue-500/20'
    }
  };

  const style = seasonStyles[activeSeason];

  const currentThemeBg = viewMode === 'sundial'
    ? 'from-stone-100 via-stone-50 to-stone-200 text-slate-900'
    : `${selectedTerm.bgGradient || 'from-slate-950 to-slate-900'} text-slate-100`;

  return (
    <div 
      className={`min-h-screen flex flex-col font-sans relative overflow-hidden transition-all duration-700 ${
        viewMode === 'detail' 
          ? 'text-stone-850' 
          : (viewMode === 'sundial' ? 'bg-gradient-to-b ' + currentThemeBg : 'text-[#f8fafc]')
      }`}
      style={viewMode === 'detail' ? (() => {
        const s = selectedTerm.season;
        if (s === 'spring') {
          return {
            backgroundImage: 'radial-gradient(circle at 50% 25%, #fffbfb 0%, #fff0f2 40%, #ffdeeed7 75%, #ffd1e3d7 100%)',
            backgroundColor: '#fff0f2'
          };
        } else if (s === 'summer') {
          return {
            backgroundImage: 'radial-gradient(circle at 50% 25%, #fafdfb 0%, #edf9f2 40%, #d8f3e2 75%, #c2edd1 100%)',
            backgroundColor: '#edf9f2'
          };
        } else if (s === 'autumn') {
          return {
            backgroundImage: 'radial-gradient(circle at 50% 25%, #faf7f2 0%, #f7f1e8 40%, #ebdcb9 75%, #edd2a1 100%)',
            backgroundColor: '#f7f1e8'
          };
        } else {
          return {
            backgroundImage: 'radial-gradient(circle at 50% 25%, #ffffff 0%, #f6f8fa 40%, #edf0f5 75%, #e1e4eb 100%)',
            backgroundColor: '#f6f8fa'
          };
        }
      })() : {}}
    >
      
      {/* Visual background atmospheric particles */}
      {renderBackgroundParticles()}

      {/* Interactive dynamic trail particles */}
      {renderInteractiveTrail()}

      {/* Styled CSS animation overrides for particles falling */}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-20px) rotate(0deg) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) rotate(360deg) translateX(40px);
            opacity: 0;
          }
        }
        @keyframes particleFloat {
          0% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 0.95;
            filter: blur(0px);
          }
          100% {
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.15) rotate(270deg);
            opacity: 0;
            filter: blur(2px);
          }
        }
        .animate-fall {
          animation-name: fall;
        }
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(15,23,42,0.6);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(148,163,184,0.25);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(148,163,184,0.4);
        }
      `}</style>

      {/* Top Navigation Bar */}
      <header className={`relative w-full z-10 border-b px-6 py-4 transition-all duration-500 ${
        viewMode === 'sundial' 
          ? 'border-stone-200 bg-stone-100/70 backdrop-blur-md' 
          : 'border-slate-900/80 bg-slate-950/60 backdrop-blur'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & Callout */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setViewMode('sundial'); setIsShadowFixed(false); }}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative group transition-all duration-300 ${
              viewMode === 'sundial' ? 'bg-stone-200 border border-stone-300' : 'bg-slate-900 border border-slate-800'
            }`}>
              <Compass className={`w-5 h-5 transition-transform group-hover:rotate-45 duration-500 ${
                viewMode === 'sundial' ? 'text-stone-700' : style.textColor
              }`} />
              <div className={`absolute inset-0.5 rounded-lg border border-dashed opacity-60 ${
                viewMode === 'sundial' ? 'border-stone-400' : 'border-slate-700'
              }`} />
            </div>
            <div>
              <h1 className={`text-lg font-serif font-bold tracking-widest flex items-center space-x-1 transition-colors ${
                viewMode === 'sundial' ? 'text-slate-900' : 'text-slate-100'
              }`}>
                <span>日晷与二十四节气</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Sundial Solar Terms Interactive Board</p>
            </div>
          </div>

          <div className={`text-xs font-semibold font-serif px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
            viewMode === 'sundial' 
              ? 'text-slate-750 bg-stone-200/50 border border-stone-300' 
              : 'text-slate-400 bg-slate-900/40 border border-slate-850'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            <span>晷针对轨中 • 观天地之序</span>
          </div>

        </div>
      </header>

      {/* Main Container Content */}
      <main className={`flex-1 w-full flex flex-col relative z-10 transition-all duration-500 ${viewMode === 'sundial' ? 'p-0 max-w-none' : 'max-w-7xl mx-auto p-4 sm:p-6 justify-center'}`}>
        <AnimatePresence mode="wait">
          {viewMode === 'sundial' ? (
            <motion.div
              key="sundial-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative w-full flex-1 min-h-[calc(100vh-160px)] flex flex-col items-center justify-center select-none overflow-hidden"
            >
              {/* Four Quadrants: Spring, Summer, Autumn, Winter stretching fully in background corners */}
              
              {/* Top Left: Spring */}
              <button
                onClick={() => handleSeasonChange('spring')}
                className={`absolute top-0 left-0 w-[50%] h-[50%] overflow-hidden cursor-pointer transition-all duration-[800ms] ease-out z-10 select-none ${
                  activeSeason === 'spring'
                    ? 'opacity-100 scale-100 z-20'
                    : 'opacity-30 hover:opacity-90 hover:scale-[1.01] grayscale-[40%] hover:grayscale-0'
                }`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
                title="春季"
              >
                <img
                  src={springImg}
                  alt="春"
                  className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Diagonal Edge Stroke */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line 
                    x1="100" y1="0" x2="0" y2="100" 
                    stroke={activeSeason === 'spring' ? '#10b981' : 'rgba(255,255,255,0.18)'} 
                    strokeWidth={activeSeason === 'spring' ? '3' : '0.6'} 
                    className="transition-all duration-700"
                  />
                </svg>

                {/* Corner Stamp */}
                <div className="absolute top-5 left-5 sm:top-10 sm:left-10 md:top-16 md:left-16 flex items-center justify-center">
                  <span className={`font-serif font-black text-sm sm:text-base md:text-xl lg:text-3xl w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                    activeSeason === 'spring'
                      ? 'bg-emerald-500 text-white font-extrabold rotate-0 scale-110 ring-4 ring-emerald-500/20'
                      : 'bg-white/80 md:bg-white/90 text-stone-700 backdrop-blur-sm shadow-md'
                  }`}>
                    春
                  </span>
                </div>
              </button>

              {/* Top Right: Summer */}
              <button
                onClick={() => handleSeasonChange('summer')}
                className={`absolute top-0 right-0 w-[50%] h-[50%] overflow-hidden cursor-pointer transition-all duration-[800ms] ease-out z-10 select-none ${
                  activeSeason === 'summer'
                    ? 'opacity-100 scale-100 z-20'
                    : 'opacity-30 hover:opacity-90 hover:scale-[1.01] grayscale-[40%] hover:grayscale-0'
                }`}
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
                title="夏季"
              >
                <img
                  src={summerImg}
                  alt="夏"
                  className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Diagonal Edge Stroke */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line 
                    x1="0" y1="0" x2="100" y2="100" 
                    stroke={activeSeason === 'summer' ? '#f59e0b' : 'rgba(255,255,255,0.18)'} 
                    strokeWidth={activeSeason === 'summer' ? '3' : '0.6'} 
                    className="transition-all duration-700"
                  />
                </svg>

                {/* Corner Stamp */}
                <div className="absolute top-5 right-5 sm:top-10 sm:right-10 md:top-16 md:right-16 flex items-center justify-center">
                  <span className={`font-serif font-black text-sm sm:text-base md:text-xl lg:text-3xl w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                    activeSeason === 'summer'
                      ? 'bg-amber-500 text-white font-extrabold rotate-0 scale-110 ring-4 ring-amber-500/20'
                      : 'bg-white/80 md:bg-white/90 text-stone-700 backdrop-blur-sm shadow-md'
                  }`}>
                    夏
                  </span>
                </div>
              </button>

              {/* Bottom Left: Autumn */}
              <button
                onClick={() => handleSeasonChange('autumn')}
                className={`absolute bottom-0 left-0 w-[50%] h-[50%] overflow-hidden cursor-pointer transition-all duration-[800ms] ease-out z-10 select-none ${
                  activeSeason === 'autumn'
                    ? 'opacity-100 scale-100 z-20'
                    : 'opacity-30 hover:opacity-90 hover:scale-[1.01] grayscale-[40%] hover:grayscale-0'
                }`}
                style={{ clipPath: 'polygon(0 0, 0 100%, 100% 100%)' }}
                title="秋季"
              >
                <img
                  src={autumnImg}
                  alt="秋"
                  className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Diagonal Edge Stroke */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line 
                    x1="0" y1="0" x2="100" y2="100" 
                    stroke={activeSeason === 'autumn' ? '#f97316' : 'rgba(255,255,255,0.18)'} 
                    strokeWidth={activeSeason === 'autumn' ? '3' : '0.6'} 
                    className="transition-all duration-700"
                  />
                </svg>

                {/* Corner Stamp */}
                <div className="absolute bottom-5 left-5 sm:bottom-10 sm:left-10 md:bottom-16 md:left-16 flex items-center justify-center">
                  <span className={`font-serif font-black text-sm sm:text-base md:text-xl lg:text-3xl w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                    activeSeason === 'autumn'
                      ? 'bg-orange-500 text-white font-extrabold rotate-0 scale-110 ring-4 ring-orange-500/20'
                      : 'bg-white/80 md:bg-white/90 text-stone-700 backdrop-blur-sm shadow-md'
                  }`}>
                    秋
                  </span>
                </div>
              </button>

              {/* Bottom Right: Winter */}
              <button
                onClick={() => handleSeasonChange('winter')}
                className={`absolute bottom-0 right-0 w-[50%] h-[50%] overflow-hidden cursor-pointer transition-all duration-[800ms] ease-out z-10 select-none ${
                  activeSeason === 'winter'
                    ? 'opacity-100 scale-100 z-20'
                    : 'opacity-30 hover:opacity-90 hover:scale-[1.01] grayscale-[40%] hover:grayscale-0'
                }`}
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
                title="冬季"
              >
                <img
                  src={winterImg}
                  alt="冬"
                  className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Diagonal Edge Stroke */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line 
                    x1="100" y1="0" x2="0" y2="100" 
                    stroke={activeSeason === 'winter' ? '#3b82f6' : 'rgba(255,255,255,0.18)'} 
                    strokeWidth={activeSeason === 'winter' ? '3' : '0.6'} 
                    className="transition-all duration-700"
                  />
                </svg>

                {/* Corner Stamp */}
                <div className="absolute bottom-5 right-5 sm:bottom-10 sm:right-10 md:bottom-16 md:right-16 flex items-center justify-center">
                  <span className={`font-serif font-black text-sm sm:text-base md:text-xl lg:text-3xl w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                    activeSeason === 'winter'
                      ? 'bg-blue-500 text-white font-extrabold rotate-0 scale-110 ring-4 ring-blue-500/20'
                      : 'bg-white/80 md:bg-white/90 text-stone-700 backdrop-blur-sm shadow-md'
                  }`}>
                    冬
                  </span>
                </div>
              </button>

              {/* Centered Sundial Interactive Plate floating above background */}
              <div className="relative z-30 pointer-events-auto filter drop-shadow-3xl transform scale-90 sm:scale-95 md:scale-100">
                <SundialPlate
                  activeSeason={activeSeason}
                  selectedTerm={selectedTerm}
                  onTermSelected={handleTermSelectedFromSundial}
                  isShadowFixed={isShadowFixed}
                  setIsShadowFixed={(fixed) => {
                    setIsShadowFixed(fixed);
                    if (fixed) {
                      // Click shadow to lock -> Auto-travel/navigate instantly to the dedicated detail long chronicle page!
                      setTimeout(() => {
                         setViewMode('detail');
                      }, 250);
                    }
                  }}
                  onHourChange={setCurrentHour}
                  handPointer={handPointer}
                />
              </div>

            </motion.div>
          ) : (
            // Solar Term Detail View
            <div key="detail-view-container">
              <SolarTermDetail
                term={selectedTerm}
                onBack={() => {
                  setViewMode('sundial');
                  setIsShadowFixed(false); // Make sure shadow is unlocked when they come back to explore!
                }}
                handPointer={handPointer}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Styled Human Footer Credit details */}
      <footer className={`w-full border-t py-6 px-6 z-10 transition-all duration-500 ${
        viewMode === 'sundial' 
          ? 'border-stone-200 bg-stone-100/80 backdrop-blur-md' 
          : 'border-slate-900 bg-slate-950/60 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-gray-500 text-xs font-mono gap-4">
          <div className="flex items-center space-x-1 text-center md:text-left">
            <span>© 2026 日晷志 · 二十四节气光影刻度</span>
          </div>
          <div className="text-center md:text-right flex items-center space-x-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className={viewMode === 'sundial' ? 'text-slate-600 font-semibold' : 'text-slate-400'}>
              光影指针对轨 · 节气智慧常新
            </span>
          </div>
        </div>
      </footer>

      {/* Global Interactive Hand Gesture Overlay Cursor & Actions */}
      <GestureOverlay handPointer={handPointer} termColor={selectedTerm.themeColor} />

      {/* Global Floating Hand Gesture Camera Tracker Widget */}
      <HandTracker onHandUpdate={setHandPointer} termColor={selectedTerm.themeColor} isDetailsMode={viewMode === 'detail'} />

    </div>
  );
}
