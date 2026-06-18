/**
 * Types for the Sundial Solar Terms application
 */

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export interface SolarTerm {
  id: string;
  name: string;
  englishName: string;
  pinyin: string;
  season: Season;
  shadowLevel: number; // 0 (innermost/shortest) to 5 (outermost/longest)
  dates: string; // e.g., "2月3日 - 2月5日"
  description: string; // Poetic overview
  threePhases: string[]; // 三候
  customs: string[]; // 传统民俗
  recommendation: string; // 养生建议
  climate: string; // 气候特征
  poetry: {
    title: string;
    author: string;
    content: string; // HTML or string with newlines
  };
  themeColor: string; // Hex color for highlights
  bgGradient: string; // Tailwind background gradient classes
  accentColor: string; // Tailwind color class for borders/buttons (e.g., "emerald-500")
}

export interface HourMapping {
  name: string; // e.g., "午时"
  range: string; // e.g., "11:00 - 13:00"
  description: string; // e.g., "日中，太阳最猛烈之时"
  meridian: string; // e.g., "心经 当令"
}
