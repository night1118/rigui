import React, { useState, useEffect } from 'react';
import { Season, SolarTerm, HourMapping } from './types';
import { solarTermsData, seasonsData, hoursData } from './data';
import SundialPlate from './components/SundialPlate';
import SolarTermDetail from './components/SolarTermDetail';
import HandTracker, { HandData } from './components/HandTracker';
import GestureOverlay from './components/GestureOverlay';
import { Compass, CalendarDays, BookOpen, Clock, Waves, ChevronRight, Wind, Snowflake, Flame, Sun, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeSeason, setActiveSeason] = useState<Season>('spring');
  const [selectedTerm, setSelectedTerm] = useState<SolarTerm>(solarTermsData[0]); // default 立春
  const [currentHour, setCurrentHour] = useState<HourMapping>(hoursData[6]); // default 午时
  const [isShadowFixed, setIsShadowFixed] = useState(false);
  const [viewMode, setViewMode] = useState<'sundial' | 'detail'>('sundial');
  const [handPointer, setHandPointer] = useState<HandData | null>(null);

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
    const particlesCount = 24;
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
        viewMode === 'sundial' ? 'bg-gradient-to-b ' + currentThemeBg : 'text-[#f8fafc]'
      }`}
      style={viewMode === 'detail' ? {
        backgroundImage: `radial-gradient(circle at 50% 25%, ${selectedTerm.themeColor}1c 0%, #030712 90%)`,
        backgroundColor: '#030712'
      } : {}}
    >
      
      {/* Visual background atmospheric particles */}
      {renderBackgroundParticles()}

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
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center relative z-10">
        <AnimatePresence mode="wait">
          {viewMode === 'sundial' ? (
            <motion.div
              key="sundial-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="w-full flex flex-col gap-6 py-4"
            >
              
              {/* Highlight Prominent Season Selector Dashboard (Highly visible to replace the easily missed top-right nav) */}
              <div id="prominent-season-selector-dashboard" className={`w-full max-w-4xl mx-auto mb-2 backdrop-blur-md border p-3 sm:p-5 rounded-3xl shadow-xl relative overflow-hidden transition-all duration-500 ${
                viewMode === 'sundial' 
                  ? 'bg-stone-50/80 border-stone-250 shadow-md' 
                  : 'bg-slate-900/40 border-slate-800 shadow-xl'
              }`}>
                <div className={`absolute top-0 left-0 right-0 h-[1px] ${
                  viewMode === 'sundial' ? 'bg-stone-200' : 'bg-gradient-to-r from-transparent via-slate-600/35 to-transparent'
                }`} />
                
                <h3 className={`text-[10px] font-sans font-bold tracking-widest uppercase text-center mb-3 transition-colors ${
                  viewMode === 'sundial' ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  ☯ 四季流转系统轨道 • SELECT SEASON ORBITAL PATHWAY
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  {(['spring', 'summer', 'autumn', 'winter'] as Season[]).map((season) => {
                    const info = seasonsData[season];
                    const isActive = activeSeason === season;
                    
                    let icon = "🌸";
                    let label = "春 • 发生万物";
                    let poet = "东风解冻，春和景明";
                    let badge = "春";
                    if (season === 'spring') {
                      icon = "🌸"; label = "春 • 发生万物"; poet = "东风解冻，春美景和"; badge = "春";
                    } else if (season === 'summer') {
                      icon = "☀️"; label = "夏 • 盛长茂郁"; poet = "万物繁盛，流火如夏"; badge = "夏";
                    } else if (season === 'autumn') {
                      icon = "🍁"; label = "秋 • 获收敛美"; poet = "白露秋霜，金色收仓"; badge = "秋";
                    } else {
                      icon = "❄️"; label = "冬 • 藏闭纳养"; poet = "朔风冷傲，万象藏聚"; badge = "冬";
                    }

                    return (
                      <button
                        key={season}
                        id={`season-btn-${season}`}
                        onClick={() => handleSeasonChange(season)}
                        className={`group relative text-left p-3 sm:p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden ${
                          isActive 
                            ? 'bg-stone-100 border-stone-300 shadow-md' 
                            : viewMode === 'sundial'
                              ? 'bg-stone-200/40 border-stone-200 hover:border-stone-300 hover:bg-stone-100/65'
                              : 'bg-slate-950/40 border-slate-850 hover:border-slate-800 hover:bg-slate-900/10'
                        }`}
                        style={isActive ? { borderColor: info.themeColor, boxShadow: `0 8px 16px -8px ${info.themeColor}55` } : {}}
                      >
                        {/* Ambient glow in button */}
                        <div 
                          className="absolute right-0 bottom-0 w-12 h-12 rounded-full opacity-10 filter blur-[15px] transition-transform duration-500 group-hover:scale-150"
                          style={{ backgroundColor: info.themeColor }}
                        />

                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover:scale-110">{icon}</span>
                          <span className={`text-[9px] font-mono tracking-widest px-1.5 py-0.5 rounded-md ${isActive ? 'bg-slate-950/60 font-bold' : 'bg-slate-950/20 text-slate-500'}`} style={isActive ? { color: info.themeColor } : {}}>
                            {badge}
                          </span>
                        </div>

                        <div>
                          <div className={`text-base font-serif font-bold tracking-wide transition-colors ${
                            isActive 
                              ? 'text-slate-900 font-extrabold' 
                              : viewMode === 'sundial'
                                ? 'text-slate-700 group-hover:text-slate-900'
                                : 'text-slate-400 group-hover:text-slate-200'
                          }`}>
                            {label}
                          </div>
                          <div className={`text-[10px] font-serif leading-none mt-1 line-clamp-1 truncate transition-colors ${
                            isActive 
                              ? 'text-slate-600 font-medium' 
                              : 'text-stone-500 group-hover:text-stone-700'
                          }`}>
                            {poet}
                          </div>
                        </div>

                        {/* Top neon strip */}
                        {isActive && (
                          <div className="absolute left-0 right-0 top-0 h-[2px]" style={{ backgroundColor: info.themeColor }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main Content Layout Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Hand Tracker & Minimal Info */}
                <div className="lg:col-span-4 space-y-4 order-2 lg:order-1 select-none">
                  <div className="space-y-1">
                    <span className={`inline-block px-2 py-0.5 border rounded-lg text-[9px] font-mono font-semibold tracking-widest ${style.badgeColor}`}>
                      {seasonsData[activeSeason].nameFull}
                    </span>
                    <h2 className={`text-lg font-serif font-black tracking-wider transition-colors ${
                      viewMode === 'sundial' ? 'text-slate-850' : 'text-slate-100'
                    }`}>
                      隔空对轨感应 ☯
                    </h2>
                  </div>

                  {/* High Fidelity Gesture Live Status Monitor Table Card */}
                  <div className="bg-stone-50/80 border border-stone-250/90 rounded-2xl p-4 shadow-sm space-y-3 transition-all">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-mono text-stone-500 font-semibold">控轨状态 MONITOR</span>
                      {handPointer && handPointer.isActive ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-[9px] font-mono font-bold text-emerald-700 border border-emerald-250 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>手势已捕获</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-[9px] font-mono font-bold text-amber-700 border border-amber-200/80 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          <span>相机就绪中</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-stone-100/75 rounded-xl border border-stone-200/55">
                        <div className="font-serif font-black text-slate-800 text-[11px] mb-0.5">☝️ 隔空指划</div>
                        <p className="text-[9.5px] text-slate-500 leading-snug">
                          双指移动对准晷面刻度，选择节气
                        </p>
                      </div>

                      <div className="p-2.5 bg-stone-100/75 rounded-xl border border-stone-200/55">
                        <div className="font-serif font-black text-slate-850 text-[11px] mb-0.5">✊ 弯指锁定</div>
                        <p className="text-[9.5px] text-slate-500 leading-snug">
                          合拢双指或锁定悬停 1.2 秒进入详情
                        </p>
                      </div>
                    </div>

                    <p className="text-[9px] leading-tight text-slate-400 text-center font-sans">
                      * 摄像头位于页面左下角，保障大屏流畅操控
                    </p>
                  </div>

                  <div className={`h-[1px] bg-gradient-to-r ${
                    viewMode === 'sundial' 
                      ? 'from-stone-300 via-stone-200 to-transparent' 
                      : 'from-slate-900 via-slate-800 to-transparent'
                  }`} />

                  {/* Simplified Current Hour mini card */}
                  <div className={`backdrop-blur rounded-2xl p-4 border flex items-center justify-between shadow-sm transition-all duration-300 ${
                    viewMode === 'sundial' 
                      ? 'bg-stone-100/50 border-stone-200/60' 
                      : 'bg-slate-900/30 border-slate-900/80'
                  }`}>
                    <div className="flex items-center space-x-2.5">
                      <Clock className={`w-4 h-4 ${style.textColor}`} />
                      <div>
                        <span className={`text-xs font-bold font-serif ${viewMode === 'sundial' ? 'text-slate-800' : 'text-slate-200'}`}>{currentHour.name}</span>
                        <span className="text-[10px] font-mono text-slate-500 ml-1.5">{currentHour.range}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all ${
                      viewMode === 'sundial' 
                        ? 'bg-stone-200/50 border-stone-300 text-slate-700' 
                        : `bg-slate-950/40 border-slate-800 ${style.textColor}`
                    }`}>
                      经穴: {currentHour.meridian}
                    </span>
                  </div>
                </div>

                {/* Central Column: Sundial Board */}
                <div className="lg:col-span-4 flex items-center justify-center order-1 lg:order-2">
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

                {/* Right Column: Matched solar term instant card */}
                <div className="lg:col-span-4 order-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedTerm.id}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className={`backdrop-blur-md rounded-3xl p-5 border shadow-xl relative overflow-hidden flex flex-col justify-between h-full min-h-[300px] max-w-sm mx-auto lg:mx-0 transition-all duration-500 ${
                        viewMode === 'sundial' 
                          ? 'bg-stone-50/85 border-stone-250 shadow-md' 
                          : 'bg-slate-900/40 border-slate-800'
                      }`}
                      style={{ backgroundImage: `radial-gradient(circle at 90% 10%, ${selectedTerm.themeColor}11 0%, transparent 100%)` }}
                    >
                      <div>
                        {/* Accent highlight bar */}
                        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: selectedTerm.themeColor }} />

                        <div className="flex justify-between items-center mb-3">
                          <h3 className={`text-xl font-serif font-black tracking-wide flex items-baseline space-x-1.5 transition-colors ${
                            viewMode === 'sundial' ? 'text-slate-900' : 'text-slate-100'
                          }`}>
                            <span>{selectedTerm.name}</span>
                            <span className="text-xs font-sans text-stone-500 font-normal">({selectedTerm.pinyin})</span>
                          </h3>
                          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border transition-all ${
                            viewMode === 'sundial' 
                              ? 'text-slate-850 bg-stone-100/90 border-stone-250' 
                              : 'text-gray-400 bg-slate-950/60 border-slate-900'
                          }`}>
                            {selectedTerm.dates}
                          </span>
                        </div>

                        {/* Brief Introduction */}
                        <p className={`text-xs leading-relaxed font-sans transition-colors ${
                          viewMode === 'sundial' ? 'text-slate-650 font-medium animate-fade-in' : 'text-slate-300'
                        }`}>
                          {selectedTerm.description}
                        </p>

                        <div className={`h-px my-3.5 ${viewMode === 'sundial' ? 'bg-stone-250/70' : 'bg-slate-900'}`} />

                        {/* Streamlined metadata inline grid: 2 simple columns */}
                        <div className="grid grid-cols-2 gap-2 text-[10.5px] font-sans">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-serif font-bold text-stone-500">候:</span>
                            <span className={`truncate leading-none ${viewMode === 'sundial' ? 'text-stone-850 font-medium' : 'text-slate-200'}`}>
                              {selectedTerm.threePhases[0].split(' (')[0]}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-serif font-bold text-stone-500">民俗:</span>
                            <span className={`truncate leading-none ${viewMode === 'sundial' ? 'text-stone-350 font-medium' : 'text-slate-200'}`}>
                              {selectedTerm.customs[0].split(' (')[0]}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Entrance CTA Portal Button */}
                      <div className="mt-4">
                        <button
                          onClick={() => setViewMode('detail')}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold font-serif transition-colors flex items-center justify-center space-x-2 cursor-pointer relative group overflow-hidden border border-slate-250 hover:bg-stone-50 text-slate-800 shadow-sm"
                        >
                          <span>探索“{selectedTerm.name}”长卷</span>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 duration-300" style={{ color: selectedTerm.themeColor }} />
                          
                          {/* Glow indicator line */}
                          <div 
                            className="absolute bottom-0 left-0 w-full h-[2px] opacity-65 group-hover:opacity-100 transition-all"
                            style={{ backgroundColor: selectedTerm.themeColor }}
                          />
                        </button>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

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
