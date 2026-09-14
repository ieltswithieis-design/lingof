import React from "react";
import { motion } from "motion/react";

interface LingofiLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "white";
  className?: string;
}

export const LingofiLogo: React.FC<LingofiLogoProps> = ({
  size = "md",
  variant = "full",
  className = ""
}) => {
  const iconDimensions = {
    sm: "h-8 w-8",
    md: "h-10 w-10 sm:h-11 sm:w-11",
    lg: "h-14 w-14",
    xl: "h-20 w-20"
  }[size];

  const titleSize = {
    sm: "text-base tracking-tight",
    md: "text-lg sm:text-xl tracking-tight",
    lg: "text-2xl sm:text-3xl tracking-tight",
    xl: "text-3xl sm:text-4xl tracking-tight"
  }[size];

  const subtitleSize = {
    sm: "text-[9.5px]",
    md: "text-[10.5px] sm:text-[11px]",
    lg: "text-xs",
    xl: "text-sm"
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* ELITE VECTOR CREST EMBLEM */}
      <motion.div
        whileHover={{ scale: 1.06, rotate: [0, -1, 1, 0] }}
        transition={{ duration: 0.3 }}
        className={`relative ${iconDimensions} shrink-0 rounded-2xl shadow-[0_4px_16px_rgba(0,45,98,0.25)] ring-1 ring-black/10 overflow-hidden cursor-pointer`}
        title="Lingofi • Official IELTS Academic Testing Insignia"
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          <defs>
            {/* Base Shield Deep Academic Navy Gradient */}
            <linearGradient id="lfNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#02122c" />
              <stop offset="45%" stopColor="#002d62" />
              <stop offset="100%" stopColor="#084288" />
            </linearGradient>

            {/* Radiant 24K Burnished Gold */}
            <linearGradient id="lfGoldLuxe" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff2a3" />
              <stop offset="25%" stopColor="#facc15" />
              <stop offset="65%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>

            {/* Electric Cyan Accent Sheen */}
            <linearGradient id="lfCyanAccent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            {/* Bevel Reflection Mask */}
            <linearGradient id="lfShineGlass" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Drop Shadow Filter */}
            <filter id="lfShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Shield Outer Body */}
          <rect width="120" height="120" rx="28" fill="url(#lfNavyGrad)" />

          {/* Inner Precision Rim 1: Metallic Gold */}
          <rect
            x="5"
            y="5"
            width="110"
            height="110"
            rx="23"
            stroke="url(#lfGoldLuxe)"
            strokeWidth="2"
            strokeOpacity="0.75"
          />

          {/* Inner Precision Rim 2: Subtle Blue Inset */}
          <rect
            x="10"
            y="10"
            width="100"
            height="100"
            rx="18"
            stroke="url(#lfCyanAccent)"
            strokeWidth="1"
            strokeOpacity="0.3"
          />

          {/* Diagonal Glass Sheen across Top Half */}
          <path
            d="M5 28 C5 15, 15 5, 28 5 H92 C105 5, 115 15, 115 28 V45 L5 85 Z"
            fill="url(#lfShineGlass)"
          />

          {/* HERALDIC ELEMENTS */}
          {/* 1. Academic Laurel Wing (Left side heraldry) */}
          <g opacity="0.35" stroke="url(#lfGoldLuxe)" strokeWidth="1.5" fill="none">
            <path d="M22 68 C18 55, 20 40, 26 30" />
            <path d="M20 58 C16 52, 22 48, 22 48" />
            <path d="M23 46 C20 40, 26 38, 26 38" />
          </g>

          {/* 2. Academic Laurel Wing (Right side heraldry) */}
          <g opacity="0.35" stroke="url(#lfGoldLuxe)" strokeWidth="1.5" fill="none">
            <path d="M98 68 C102 55, 100 40, 94 30" />
            <path d="M100 58 C104 52, 98 48, 98 48" />
            <path d="M97 46 C100 40, 94 38, 94 38" />
          </g>

          {/* 3. The Grand Stylized "L" - Academic Monumental Serif */}
          {/* Vertical Stem with Beveled Crown */}
          <path
            d="M34 26 C34 24, 36 22, 39 22 H47 C50 22, 52 24, 52 27 V78 C52 80.5, 54 82, 57 82 H84 C87 82, 89 84, 89 87 V91 C89 94, 87 96, 84 96 H44 C38.5 96, 34 91.5, 34 86 V26 Z"
            fill="#ffffff"
            filter="url(#lfShadow)"
          />

          {/* Dual Soaring Golden Quills / Band 9 Flight Chevrons */}
          {/* Upper Chevron - Ascending Knowledge */}
          <path
            d="M58 28 L84 42 L58 56 L69 42 Z"
            fill="url(#lfGoldLuxe)"
            filter="url(#lfShadow)"
          />
          {/* Lower Chevron - Global Achievement */}
          <path
            d="M68 48 L94 62 L68 76 L79 62 Z"
            fill="url(#lfGoldLuxe)"
            opacity="0.95"
            filter="url(#lfShadow)"
          />

          {/* Apex 8-Pointed North Star / Band 9 Diamond */}
          <g transform="translate(90, 26)">
            <path
              d="M0 -8 L2.5 -2.5 L8 0 L2.5 2.5 L0 8 L-2.5 2.5 L-8 0 L-2.5 -2.5 Z"
              fill="url(#lfGoldLuxe)"
            />
            <circle cx="0" cy="0" r="1.5" fill="#ffffff" />
          </g>

          {/* Bottom Verification Seal Point */}
          <circle cx="60" cy="107" r="2.5" fill="url(#lfGoldLuxe)" />
        </svg>
      </motion.div>

      {/* BRAND TYPOGRAPHY & OFFICIAL ACCREDITATION BADGES */}
      {variant !== "icon" && (
        <div className="flex flex-col text-left">
          {/* Primary Wordmark Line */}
          <div className="flex items-center gap-1.5 sm:gap-2 leading-none">
            <span
              className={`font-serif font-black ${titleSize} ${
                variant === "white" 
                  ? "text-white drop-shadow-xs" 
                  : "bg-gradient-to-r from-[#002d62] via-[#0a3a75] to-[#1e3a8a] bg-clip-text text-transparent"
              }`}
            >
              lingofi
            </span>

            {/* Academic Standard Pill Badge */}
            <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-1.5 sm:px-2 py-0.5 text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider text-white shadow-[0_2px_8px_rgba(220,38,38,0.3)] ring-1 ring-white/20">
              <span>Academic</span>
              <span className="hidden sm:inline opacity-70">★</span>
              <span className="hidden sm:inline">Band 9</span>
            </span>
          </div>

          {/* Subtitle & Official Verification Indicator */}
          <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
            <span
              className={`font-semibold tracking-wide ${subtitleSize} ${
                variant === "white" ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Official IELTS Testing & Practice
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
