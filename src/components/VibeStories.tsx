import React from 'react';
import { PRESET_VIBES } from '../data/presetVibes';
import { PresetVibe } from '../types';
import { Sparkles, Flame } from 'lucide-react';

interface VibeStoriesProps {
  onSelectVibe: (vibe: PresetVibe) => void;
  activeVibeTitle?: string;
}

export const VibeStories: React.FC<VibeStoriesProps> = ({
  onSelectVibe,
  activeVibeTitle,
}) => {
  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
          <span>Curated Vibe Inspirations</span>
        </span>
        <span className="text-[11px] text-amber-400/80 font-medium">Tap to try</span>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-none px-1">
        {PRESET_VIBES.map((preset) => {
          const isActive = activeVibeTitle === preset.title;
          return (
            <button
              key={preset.id}
              onClick={() => onSelectVibe(preset)}
              className="flex-shrink-0 flex flex-col items-center group focus:outline-none"
            >
              {/* Glowing Story Ring */}
              <div
                className={`p-0.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 ring-2 ring-amber-400 ring-offset-2 ring-offset-[#090b0e] scale-105'
                    : 'bg-gradient-to-tr from-amber-500/50 via-zinc-700 to-zinc-800 hover:scale-105'
                }`}
              >
                <div className="p-0.5 bg-[#090b0e] rounded-full">
                  <div className="w-14 h-14 rounded-full overflow-hidden relative shadow-md">
                    <img
                      src={preset.thumbnail}
                      alt={preset.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                </div>
              </div>

              {/* Title & Badge */}
              <span className="text-[11px] font-semibold text-zinc-300 group-hover:text-white mt-1.5 truncate max-w-[64px]">
                {preset.title}
              </span>
              <span className="text-[9px] text-amber-400/90 font-mono scale-90">
                {preset.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
