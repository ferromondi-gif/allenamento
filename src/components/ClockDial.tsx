import React from 'react';
import { motion } from 'motion/react';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils';

interface ClockDialProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function ClockDial({ value, min, max, onChange }: ClockDialProps) {
  // Map value to angle (25s -> -120deg, 70s -> 120deg)
  const range = max - min;
  const percentage = (value - min) / range;
  const angle = (percentage * 240) - 120; // 240 degrees total sweep

  // Calculate dynamic color based on percentage
  const getDynamicColor = (p: number) => {
    // Linear interpolation between Lime (189, 255, 0) and Orange/Red (255, 69, 0)
    // For simplicity, we can use hex or simple logic
    if (p < 0.5) {
      // Lime -> Yellow
      return `rgb(${189 + (255-189) * (p*2)}, 255, 0)`;
    } else {
      // Yellow -> Orange/Red
      const p2 = (p - 0.5) * 2;
      return `rgb(255, ${255 - (255-69) * p2}, 0)`;
    }
  };

  const currentColor = getDynamicColor(percentage);

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
        {/* Glow Effect */}
        <div 
          className="absolute inset-4 rounded-full blur-[30px] opacity-20 transition-colors duration-500" 
          style={{ backgroundColor: currentColor }}
        />

        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800 bg-zinc-900/50 flex items-center justify-center shadow-inner">
          {/* Tick marks - more frequent for smoother look */}
          {Array.from({ length: 46 }).map((_, i) => {
            const tickAngle = (i / 45 * 240) - 120;
            const isSet = value >= (min + (i/45)*range);
            const isFiveSecond = (min + (i/45)*range) % 5 === 0;
            
            return (
              <div 
                key={i}
                className="absolute origin-bottom"
                style={{ 
                  transform: `rotate(${tickAngle}deg) translateY(calc(-40% - 40px))`,
                  width: isFiveSecond ? '2px' : '1px',
                  height: isFiveSecond ? '8px' : '4px',
                  backgroundColor: isSet ? getDynamicColor((i/45)) : '#27272a',
                  boxShadow: isSet ? `0 0 8px ${getDynamicColor((i/45))}` : 'none',
                  bottom: '50%',
                  willChange: 'background-color, box-shadow'
                }}
              />
            );
          })}
        </div>

        {/* Center Text Wrapper */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-2xl z-10 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(circle, ${currentColor} 0%, transparent 70%)` }}
          />
          <div className="text-center z-10 select-none">
            <motion.div 
              key={value}
              initial={{ scale: 0.9, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="text-4xl sm:text-6xl font-black italic lora"
              style={{ color: currentColor }}
            >
              {value}
            </motion.div>
            <div className="text-[8px] sm:text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-[-4px]">Secondi</div>
          </div>
        </div>

        {/* Hand */}
        <motion.div 
          className="absolute w-1 h-16 sm:w-1.5 sm:h-24 origin-bottom bottom-1/2 rounded-full z-20 will-change-transform"
          style={{ backgroundColor: currentColor, boxShadow: `0 0 15px ${currentColor}` }}
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        />

        {/* Hidden Range Input for Interaction */}
        <input 
          type="range"
          min={min}
          max={max}
          step="5"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-8 w-full max-w-sm px-2 pb-4">
        {Array.from({ length: Math.floor((max - min) / 5) + 1 }, (_, i) => min + i * 5).map(v => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 font-black transition-all flex flex-col items-center justify-center",
              value === v 
                ? "bg-white border-white text-zinc-950 scale-110 shadow-lg" 
                : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
            )}
          >
            <span className="text-xs sm:text-sm">{v}</span>
            <span className="text-[7px] uppercase opacity-60">s</span>
          </button>
        ))}
      </div>
    </div>
  );
}
