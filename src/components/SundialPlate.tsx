import React, { useRef, useState, useEffect } from 'react';
import { Season, SolarTerm, HourMapping } from '../types';
import { solarTermsData, hoursData } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, RotateCw } from 'lucide-react';
import { HandData } from './HandTracker';

interface SundialPlateProps {
  activeSeason: Season;
  selectedTerm: SolarTerm;
  onTermSelected: (term: SolarTerm) => void;
  isShadowFixed: boolean;
  setIsShadowFixed: (fixed: boolean) => void;
  onHourChange?: (hour: HourMapping) => void;
  handPointer: HandData | null;
}

export default function SundialPlate({
  activeSeason,
  selectedTerm,
  onTermSelected,
  isShadowFixed,
  setIsShadowFixed,
  onHourChange,
  handPointer
}: SundialPlateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [relativePos, setRelativePos] = useState({ dx: 0, dy: 0, distance: 0, angle: 0 });
  const [currentHour, setCurrentHour] = useState<HourMapping>(hoursData[6]); // default noon (午时)

  // Get active season's solar terms, sorted by shadow level (0 = innermost, 5 = outermost)
  const seasonTermsArray = solarTermsData.filter(term => term.season === activeSeason);
  const termsByLevel = React.useMemo(() => {
    const list = [...seasonTermsArray];
    list.sort((a, b) => a.shadowLevel - b.shadowLevel);
    return list;
  }, [seasonTermsArray]);

  // Handle mouse move to calculate shadow direction and length
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isShadowFixed || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    
    // Mouse coordinates relative to target center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setMousePos({ x, y });

    const dx = x - cx;
    const dy = y - cy;
    
    // Distance from center
    const distancePx = Math.sqrt(dx * dx + dy * dy);
    // Normalize distance by radius. Plate radius is approx 180px, max responsive distance is 220px
    const maxRadius = Math.min(rect.width, rect.height) / 2;
    const rNorm = Math.min(distancePx / maxRadius, 1.05);

    // Calculate angle: 0 deg points straight up (North/Noon).
    // Clockwise angle: (atan2(dy, dx) in degrees + 90 + 360) % 360
    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    angleDeg = (angleDeg + 90 + 360) % 360;

    setRelativePos({ dx, dy, distance: rNorm, angle: angleDeg });
  };

  // Listen to hand pointer coordinate changes
  useEffect(() => {
    if (isShadowFixed || !handPointer || !handPointer.isActive || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // Map normalized coordinates to the plate bounding container
    const x = handPointer.x * rect.width;
    const y = handPointer.y * rect.height;

    setMousePos({ x, y });

    const dx = x - cx;
    const dy = y - cy;

    const distancePx = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = Math.min(rect.width, rect.height) / 2;
    const rNorm = Math.min(distancePx / maxRadius, 1.05);

    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    angleDeg = (angleDeg + 90 + 360) % 360;

    setRelativePos({ dx, dy, distance: rNorm, angle: angleDeg });
  }, [handPointer, isShadowFixed]);

  // Trigger lock if fingers are bent
  useEffect(() => {
    if (handPointer && handPointer.isActive && handPointer.isBent && !isShadowFixed) {
      setIsShadowFixed(true);
    }
  }, [handPointer?.isBent, handPointer?.isActive, isShadowFixed, setIsShadowFixed]);

  // Run calculation when relativePos details update
  useEffect(() => {
    if (isShadowFixed) return;

    const { distance, angle } = relativePos;
    if (distance === 0) return;

    // 1. Calculate active hourly Shichen based on angle (12 segments of 30deg)
    // Midnight Shichen (子时) centered around 0deg (345deg to 15deg)
    // Shift angle by +15deg so that 345-15 maps to the top sector segment.
    const shiftedAngle = (angle + 15) % 360;
    const hourIndex = Math.floor(shiftedAngle / 30);
    // Hour layout clockwise from Midnight (子时 / 0deg):
    // 0: 子, 1: 丑, 2: 寅, 3: 卯, 4: 辰, 5: 巳, 6: 午, 7: 未, 8: 申, 9: 酉, 10: 戌, 11: 亥
    const hourSequence = ["子时", "丑时", "寅时", "卯时", "辰时", "巳时", "午时", "未时", "申时", "酉时", "戌时", "亥时"];
    const matchedHourName = hourSequence[hourIndex];
    const matchedHour = hoursData.find(h => h.name === matchedHourName) || hoursData[0];
    
    setCurrentHour(matchedHour);
    if (onHourChange) {
      onHourChange(matchedHour);
    }

    // 2. Map normalized distance rNorm to Shadow Level (0 to 5)
    // Radius goes from approx 0.12 (inner) to 0.95 (outer border)
    let matchedShadowLevel = 0;
    if (distance <= 0.28) {
      matchedShadowLevel = 0;
    } else if (distance <= 0.41) {
      matchedShadowLevel = 1;
    } else if (distance <= 0.54) {
      matchedShadowLevel = 2;
    } else if (distance <= 0.67) {
      matchedShadowLevel = 3;
    } else if (distance <= 0.80) {
      matchedShadowLevel = 4;
    } else {
      matchedShadowLevel = 5;
    }

    // Find the term matching this level
    const matchedTerm = termsByLevel.find(t => t.shadowLevel === matchedShadowLevel);
    if (matchedTerm && matchedTerm.id !== selectedTerm.id) {
      onTermSelected(matchedTerm);
    }
  }, [relativePos, termsByLevel, selectedTerm, isShadowFixed, onHourChange, onTermSelected]);

  // Click handler to freeze the shadow
  const handlePlateClick = () => {
    setIsShadowFixed(!isShadowFixed);
  };

  // Get active color configuration
  const themeColorsMap: Record<Season, { line: string, glow: string, badge: string }> = {
    spring: { line: 'border-emerald-500/20 text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)] bg-emerald-500/10 border-emerald-400', badge: 'bg-emerald-900/40 text-emerald-300 border-emerald-800' },
    summer: { line: 'border-amber-500/20 text-amber-400', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)] bg-amber-500/10 border-amber-400', badge: 'bg-amber-900/40 text-amber-300 border-amber-800' },
    autumn: { line: 'border-orange-500/20 text-orange-400', glow: 'shadow-[0_0_20px_rgba(234,88,12,0.35)] bg-orange-500/10 border-orange-400', badge: 'bg-orange-900/40 text-orange-300 border-orange-850' },
    winter: { line: 'border-blue-500/20 text-blue-400', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.35)] bg-blue-500/10 border-blue-400', badge: 'bg-blue-900/40 text-blue-300 border-blue-800' }
  };

  const activeTheme = themeColorsMap[activeSeason];

  // Helper values for concentric rings visual heights
  const ringLimits = [45, 80, 115, 150, 185, 220]; // 6 radii for concentric rings in pixels

  return (
    <div className="flex flex-col items-center">
      
      {/* Dynamic Status Bar */}
      <div className="w-full max-w-lg mb-6 px-4 py-3 bg-stone-100 border border-stone-200/80 rounded-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-stone-200/60 border border-stone-300/40 animate-pulse">
            <Compass className={`w-5 h-5 ${activeTheme.line.split(' ')[1]}`} />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-mono font-medium">日影测量 / SHA-AXIS</div>
            <div className="text-sm font-semibold text-slate-850 flex items-center space-x-2">
              <span>{currentHour.name}</span>
              <span className="text-[11px] text-slate-500 font-semibold">({currentHour.range})</span>
            </div>
          </div>
        </div>
        
        <div className="h-8 w-px bg-stone-200" />

        <div className="text-right">
          <div className="text-[11px] text-slate-500 font-mono font-medium">推测节气 / SOLAR TERM</div>
          <motion.div 
            key={selectedTerm.id}
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-bold text-slate-850 flex items-center space-x-1.5 justify-end"
          >
            <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedTerm.themeColor }} />
            <span>{selectedTerm.name}</span>
            <span className="text-xs font-normal text-slate-500">({selectedTerm.pinyin})</span>
          </motion.div>
        </div>
      </div>

      {/* Main Interactive Sundial Frame */}
      <div 
        id="sundial-plate-frame"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onClick={handlePlateClick}
        className={`relative w-80 h-80 sm:w-[400px] sm:h-[400px] rounded-full bg-radial from-stone-50 via-stone-100 to-stone-200 border-2 select-none cursor-pointer transition-all duration-300 flex items-center justify-center ${isShadowFixed ? 'border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.3)]' : 'border-stone-300 hover:border-stone-400 shadow-xl'}`}
      >
        {/* Traditional Sundial Plate Vector Face (SVG) - 100% Responsive, Scales Perfectly */}
        <svg 
          viewBox="0 0 400 400" 
          className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
        >
          {/* Outer elegant double line border representing the metal-rimmed stone rim */}
          <circle cx="200" cy="200" r="193" fill="none" stroke="#78716c" strokeWidth="1.2" opacity="0.8" />
          <circle cx="200" cy="200" r="187" fill="none" stroke="#78716c" strokeWidth="0.8" opacity="0.6" strokeDasharray="300, 2" />
          
          {/* Outer circle separating the hour numbers from the scale ring */}
          <circle cx="200" cy="200" r="158" fill="none" stroke="#8c857b" strokeWidth="0.8" opacity="0.6" />

          {/* Scale Ring: Concentric boundaries for the ladder ticks */}
          <circle cx="200" cy="200" r="156" fill="none" stroke="#a8a29e" strokeWidth="0.8" opacity="0.5" />
          <circle cx="200" cy="200" r="144" fill="none" stroke="#a8a29e" strokeWidth="0.8" opacity="0.5" />

          {/* 96 Traditional Quarter/Tenth ticks (百刻制 scale) */}
          {Array.from({ length: 96 }).map((_, i) => {
            const angleDeg = i * 3.75;
            const isMajor = i % 4 === 0; // Hour sector boundaries (15 degrees)
            const isBranchBorder = i % 8 === 0; // Earthly branch boundaries (30 degrees)
            
            const angleRad = ((angleDeg - 90) * Math.PI) / 180;
            const rStart = isBranchBorder ? 138 : (isMajor ? 144 : 148);
            const rEnd = isBranchBorder ? 158 : 156;

            const x1 = 200 + rStart * Math.cos(angleRad);
            const y1 = 200 + rStart * Math.sin(angleRad);
            const x2 = 200 + rEnd * Math.cos(angleRad);
            const y2 = 200 + rEnd * Math.sin(angleRad);

            return (
              <line
                key={`tick-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isBranchBorder ? '#44403c' : '#a8a29e'}
                strokeWidth={isBranchBorder ? '1.5' : (isMajor ? '0.9' : '0.4')}
                opacity={isBranchBorder ? '0.9' : '0.65'}
              />
            );
          })}

          {/* Inner circle separating Earthly Branches from the central empty zone */}
          <circle cx="200" cy="200" r="138" fill="none" stroke="#78716c" strokeWidth="1" opacity="0.75" />
          <circle cx="200" cy="200" r="95" fill="none" stroke="#8c857b" strokeWidth="0.8" opacity="0.6" />

          {/* 12 Dividing lines between Earthly Branches */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angleDeg = i * 30 + 15; // Centered around 0, so bounds are offset by 15 deg
            const angleRad = ((angleDeg - 90) * Math.PI) / 180;
            const r1 = 95;
            const r2 = 138;

            const x1 = 200 + r1 * Math.cos(angleRad);
            const y1 = 200 + r1 * Math.sin(angleRad);
            const x2 = 200 + r2 * Math.cos(angleRad);
            const y2 = 200 + r2 * Math.sin(angleRad);

            return (
              <line
                key={`branch-line-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#8c857b"
                strokeWidth="0.8"
                opacity="0.75"
              />
            );
          })}

          {/* Hour numbers 1 to 24 arranged clockwise, centered in each 15-degree sector */}
          {Array.from({ length: 24 }).map((_, i) => {
            const hourNum = i + 1;
            // 1 is at 7.5 deg clockwise from top (which is -82.5 deg)
            const angleRad = ((hourNum * 15 - 7.5 - 90) * Math.PI) / 180;
            const rText = 171;
            const tx = 200 + rText * Math.cos(angleRad);
            const ty = 200 + rText * Math.sin(angleRad);

            // Shichen mapping check to highlight current active hour numbers
            let isActiveHour = false;
            const activeHourName = currentHour.name;
            if (activeHourName === "子时" && (hourNum === 24 || hourNum === 1)) isActiveHour = true;
            else if (activeHourName === "丑时" && (hourNum === 2 || hourNum === 3)) isActiveHour = true;
            else if (activeHourName === "寅时" && (hourNum === 4 || hourNum === 5)) isActiveHour = true;
            else if (activeHourName === "卯时" && (hourNum === 6 || hourNum === 7)) isActiveHour = true;
            else if (activeHourName === "辰时" && (hourNum === 8 || hourNum === 9)) isActiveHour = true;
            else if (activeHourName === "巳时" && (hourNum === 10 || hourNum === 11)) isActiveHour = true;
            else if (activeHourName === "午时" && (hourNum === 12 || hourNum === 13)) isActiveHour = true;
            else if (activeHourName === "未时" && (hourNum === 14 || hourNum === 15)) isActiveHour = true;
            else if (activeHourName === "申时" && (hourNum === 16 || hourNum === 17)) isActiveHour = true;
            else if (activeHourName === "酉时" && (hourNum === 18 || hourNum === 19)) isActiveHour = true;
            else if (activeHourName === "戌时" && (hourNum === 20 || hourNum === 21)) isActiveHour = true;
            else if (activeHourName === "亥时" && (hourNum === 22 || hourNum === 23)) isActiveHour = true;

            return (
              <text
                key={`hour-num-${hourNum}`}
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-serif font-black select-none pointer-events-none transition-all duration-300"
                style={{
                  fill: isActiveHour ? selectedTerm.themeColor : '#524c42',
                  fontSize: isActiveHour ? '12px' : '9.5px',
                  fontWeight: isActiveHour ? '900' : '600',
                  opacity: isActiveHour ? 1.0 : 0.65
                }}
              >
                {hourNum}
              </text>
            );
          })}

          {/* Earthly Branch Characters: 子丑寅卯辰巳午未申酉戌亥 */}
          {hoursData.map((hour, idx) => {
            const nameShort = hour.name.substring(0, 1);
            const angleDeg = idx * 30; // Clockwise starting from top 0deg
            const angleRad = ((angleDeg - 90) * Math.PI) / 180;
            const tx = 200 + 116 * Math.cos(angleRad);
            const ty = 200 + 116 * Math.sin(angleRad);

            const isActive = currentHour.name === hour.name;

            return (
              <text
                key={`branch-char-${hour.name}`}
                x={tx}
                y={ty}
                textAnchor="middle"
                dominantBaseline="central"
                className="select-none pointer-events-none transition-all duration-300 font-serif font-black"
                style={{
                  fill: isActive ? selectedTerm.themeColor : '#443e38',
                  fontSize: isActive ? '24px' : '17px',
                  fontWeight: '900',
                  opacity: isActive ? 1.0 : 0.8,
                  filter: isActive ? `drop-shadow(0 0 3px ${selectedTerm.themeColor}55)` : 'none'
                }}
              >
                {nameShort}
              </text>
            );
          })}

          {/* 6 Elegant Concentric Solar Term guidelines in the inner field */}
          {termsByLevel.map((term, idx) => {
            const isActivelySelected = term.id === selectedTerm.id;
            const r = [34, 44, 54, 64, 74, 84][idx];

            return (
              <circle
                key={term.id}
                cx="200"
                cy="200"
                r={r}
                fill="none"
                stroke={isActivelySelected ? term.themeColor : '#8c857b'}
                strokeWidth={isActivelySelected ? '1.8' : '0.5'}
                strokeDasharray={isActivelySelected ? 'none' : '2, 3'}
                opacity={isActivelySelected ? 0.9 : 0.25}
                className="transition-all duration-300 pointer-events-none"
                style={{
                  filter: isActivelySelected ? `drop-shadow(0 0 4px ${term.themeColor}99)` : 'none'
                }}
              />
            );
          })}

          {/* Center tiny pin pivot dot */}
          <circle cx="200" cy="200" r="3.5" fill="#44403c" />
        </svg>

        {/* Floating text titles for actively matched ring (HTML overlay relative to frame) */}
        {termsByLevel.map((term, idx) => {
          const isActivelySelected = term.id === selectedTerm.id;
          if (!isActivelySelected) return null;
          const rBase = [34, 44, 54, 64, 74, 84][idx];
          return (
            <div 
              key={`badge-${term.id}`}
              className="absolute pointer-events-none transition-all duration-300 flex items-center justify-center bg-slate-950/90 border px-2 py-0.5 rounded-full scale-75 shadow-lg select-none"
              style={{
                borderColor: term.themeColor,
                top: `calc(50% - ${rBase}px - 14px)`,
                left: '50%',
                transform: 'translateX(-50%)',
                boxShadow: `0 0 8px ${term.themeColor}33`,
                zIndex: 10
              }}
            >
              <span className="text-[9px] font-serif font-black tracking-widest text-[#f8fafc] whitespace-nowrap">
                {term.name}
              </span>
            </div>
          );
        })}

        {/* Dynamic Pointer Shadow Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden rounded-full">
          {/* Shadow line extending from center to cursor coordinates */}
          {relativePos.distance > 0 && (
            <>
              {/* Layer 1: Ambient Wide Soft Shadow */}
              <div 
                className="absolute origin-left pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${relativePos.angle - 90}deg)`,
                  width: `${relativePos.distance * 180}px`,
                  height: '16px',
                  marginTop: '-8px',
                  background: `linear-gradient(to right, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 60%, rgba(0, 0, 0, 0) 100%)`,
                  filter: 'blur(6px)',
                  opacity: 0.95
                }}
              />
              {/* Layer 2: Core Dense Occlusion Shadow (Sharp & Heavy) */}
              <div 
                className="absolute origin-left pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${relativePos.angle - 90}deg)`,
                  width: `${relativePos.distance * 180}px`,
                  height: '6px',
                  marginTop: '-3px',
                  background: `linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.85) 50%, rgba(0, 0, 0, 0) 100%)`,
                  filter: 'blur(1.5px)',
                  opacity: 0.98,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.9)'
                }}
              />
              {/* Subtle dynamic highlighted outline bordering the shadow to make it pop visually */}
              <div 
                className="absolute origin-left pointer-events-none opacity-40"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${relativePos.angle - 90}deg)`,
                  width: `${relativePos.distance * 175}px`,
                  height: '1px',
                  marginTop: '4px',
                  background: `linear-gradient(to right, ${selectedTerm.themeColor}aa 0%, transparent 80%)`,
                  filter: 'blur(1px)'
                }}
              />
            </>
          )}

          {/* Golden Ambient Sunlight Ray (opposite direction to shadow representing sun trajectory) */}
          {!isShadowFixed && relativePos.distance > 0 && (
            <div 
              className="absolute origin-left pointer-events-none transition-opacity duration-300 opacity-25"
              style={{
                left: '50%',
                top: '50%',
                // Standard sun rays align directly in the opposite direction (offset by 180 degrees)
                transform: `rotate(${relativePos.angle + 90}deg)`,
                width: '180px',
                height: '32px',
                marginTop: '-16px',
                background: `linear-gradient(to right, ${selectedTerm.themeColor}44 0%, ${selectedTerm.themeColor}15 65%, transparent 100%)`,
                filter: 'blur(10px)',
              }}
            />
          )}
        </div>

        {/* Center Metal Gnomon (指针 / 晷针) 2.5D visual */}
        <div className="absolute w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 shadow-md flex items-center justify-center pointer-events-none">
          {/* Central golden pivot point */}
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-600 shadow-inner" />
          
          {/* 3D Gnomon/Pin Projection - we draw a shiny angled needle that has shadow depth */}
          <div 
            className="absolute h-18 w-1 bg-gradient-to-t from-yellow-600 via-amber-400 to-yellow-100 rounded-full"
            style={{
              bottom: '50%',
              left: 'calc(50% - 2px)',
              transformOrigin: 'bottom center',
              transform: 'rotate(-25deg) scaleY(1.1)', // tilted for a 3D equatorial pointer aesthetic
              boxShadow: '1px 1px 3px rgba(0,0,0,0.5)',
            }}
          />
        </div>

        {/* Clicking Guideline Tip */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-mono tracking-wider bg-slate-950/70 border border-slate-800 px-3 py-1 rounded-full text-center flex items-center space-x-1">
          {isShadowFixed ? (
            <>
              <RotateCw className="w-3 h-3 text-amber-500 animate-spin" />
              <span className="text-amber-400 font-semibold">影子已锁定，再次点击释放 & 观察</span>
            </>
          ) : (
            <span>移动鼠标模拟时光 · 点击锁定影子</span>
          )}
        </div>
      </div>

      {/* Instructional Bubble */}
      <div className="mt-4 text-center max-w-sm px-4">
        <p className="text-xs leading-relaxed font-sans font-medium text-slate-700">
          日影的<span className="text-slate-900 font-bold">倾斜角度</span>反映出一天的<span className="text-slate-900 font-bold">时辰变化</span>；而日影的<span className="text-slate-900 font-bold" style={{ color: selectedTerm.themeColor }}>长短深浅</span>（距离晷针的远近）则标记着太阳赤纬的移动，代表着<span className="text-slate-900 font-bold">二十四节气</span>的交替流转。
        </p>
      </div>

    </div>
  );
}
