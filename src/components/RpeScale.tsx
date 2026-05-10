import React from 'react';
import { cn } from '../lib/utils';

interface RpeScaleProps {
  value: number;
  onChange: (value: number) => void;
}

const RPE_LABELS: Record<number, string> = {
  6: "Nessuno sforzo (Riposo totale)",
  7: "Estremamente leggero",
  8: "Molto leggero",
  9: "Molto leggero (Camminata lenta)",
  10: "Leggero",
  11: "Leggero (Sforzo avvertito ma facile)",
  12: "Abbastanza leggero",
  13: "Un po' faticoso (Inizio sudorazione)",
  14: "Faticoso",
  15: "Faticoso (Respiro pesante)",
  16: "Molto faticoso",
  17: "Molto faticoso (Sforzo intenso)",
  18: "Estremamente faticoso",
  19: "Il più faticoso possibile",
  20: "Sforzo massimale (Esaurimento)"
};

export function RpeScale({ value, onChange }: RpeScaleProps) {
  return (
    <div className="space-y-4 w-full max-w-xs mx-auto">
      <div className="relative h-10 flex items-center">
        {/* Gradient Track */}
        <div className="absolute inset-0 h-3 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded-full self-center" />
        
        {/* Slider Input */}
        <input
          type="range"
          min="6"
          max="20"
          step="1"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-10 opacity-0 cursor-pointer z-10"
        />

        {/* Custom Thumb/Marker */}
        <div 
          className="absolute h-7 w-7 bg-zinc-950 rounded-full border-4 border-white shadow-xl pointer-events-none flex items-center justify-center text-white font-bold transition-all"
          style={{ left: `calc(${(value - 6) / (20 - 6) * 100}% - 0.875rem)` }}
        >
          <span className="text-[10px]">{value}</span>
        </div>
      </div>

      <div className="text-center p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 shadow-inner">
        <div className="text-3xl font-black text-brand mb-1">{value}</div>
        <div className="text-sm font-medium text-zinc-200 min-h-[2.5rem] flex items-center justify-center px-4">
          {RPE_LABELS[value]}
        </div>
      </div>
      
      <div className="flex justify-between px-1 text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">
        <span>Riposo</span>
        <span>Massimale</span>
      </div>
    </div>
  );
}
