import React from 'react';
import { AspectRatio, ImageSize, ModelType } from '../types';
import { Sliders, Sparkles, Smartphone, Check, Zap } from 'lucide-react';

interface SettingsBarProps {
  aspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  imageSize: ImageSize;
  onImageSizeChange: (size: ImageSize) => void;
  model: ModelType;
  onModelChange: (model: ModelType) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const RATIOS: { label: AspectRatio; name: string; iconDesc: string; recommended?: boolean }[] = [
  { label: '9:16', name: 'Phone', iconDesc: 'Default portrait', recommended: true },
  { label: '1:1', name: 'Square', iconDesc: 'Profile / Post' },
  { label: '2:3', name: 'Classic', iconDesc: 'Photo 4x6' },
  { label: '3:2', name: 'Landscape', iconDesc: 'Camera landscape' },
  { label: '3:4', name: 'Tablet', iconDesc: 'iPad / Portrait' },
  { label: '4:3', name: 'Retro', iconDesc: 'Classic monitor' },
  { label: '16:9', name: 'Desktop', iconDesc: 'Widescreen PC' },
  { label: '21:9', name: 'Ultrawide', iconDesc: 'Cinema display' },
];

const SIZES: { size: ImageSize; label: string; desc: string }[] = [
  { size: '1K', label: '1K', desc: 'Fast generation' },
  { size: '2K', label: '2K HD', desc: 'Retina crisp' },
  { size: '4K', label: '4K UHD', desc: 'Studio resolution' },
];

export const SettingsBar: React.FC<SettingsBarProps> = ({
  aspectRatio,
  onAspectRatioChange,
  imageSize,
  onImageSizeChange,
  model,
  onModelChange,
  isOpen,
  onToggle,
}) => {
  return (
    <div className="w-full bg-[#12151c]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl mb-4 transition-all">
      {/* Header bar / Quick toggle */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">Generation Parameters</span>
            <span className="text-[11px] text-zinc-400">
              {aspectRatio} • {imageSize} • {model === 'gemini-3-pro-image-preview' ? 'Studio Pro' : 'Nano'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-medium text-amber-400">
          <span>{isOpen ? 'Close' : 'Adjust'}</span>
          <div className={`w-2 h-2 rounded-full bg-amber-500 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Expanded Controls Drawer */}
      {isOpen && (
        <div className="p-4 pt-1 border-t border-white/10 space-y-4 animate-fadeIn">
          {/* Model Engine Selector */}
          <div>
            <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider block mb-2">
              AI Generation Engine
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onModelChange('gemini-3-pro-image-preview')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  model === 'gemini-3-pro-image-preview'
                    ? 'bg-amber-500/15 border-amber-400/80 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-bold">Studio Pro</span>
                  </div>
                  {model === 'gemini-3-pro-image-preview' && (
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 font-mono truncate">gemini-3-pro-image-preview</p>
                <p className="text-[10px] text-amber-300/80 mt-1 font-medium">Studio-quality 1K-4K</p>
              </button>

              <button
                type="button"
                onClick={() => onModelChange('gemini-nano-banana-2.1')}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  model === 'gemini-nano-banana-2.1'
                    ? 'bg-amber-500/15 border-amber-400/80 text-white shadow-lg shadow-amber-500/10'
                    : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-bold">Fast Nano</span>
                  </div>
                  {model === 'gemini-nano-banana-2.1' && (
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 font-mono truncate">gemini-nano-banana-2.1</p>
                <p className="text-[10px] text-zinc-400 mt-1 font-medium">High speed generator</p>
              </button>
            </div>
          </div>

          {/* Aspect Ratio Selector (Mandatory Affordance) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                Aspect Ratio
              </label>
              <span className="text-[11px] text-amber-400 font-medium">
                {aspectRatio === '9:16' ? 'Recommended for Phone Wallpaper' : aspectRatio}
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {RATIOS.map((item) => {
                const isSelected = aspectRatio === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => onAspectRatioChange(item.label)}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-500 to-orange-600 border-amber-300 text-black font-bold shadow-md shadow-amber-500/20'
                        : 'bg-black/40 border-white/10 text-zinc-300 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold leading-none">{item.label}</span>
                    <span
                      className={`text-[9px] mt-1 truncate max-w-full ${
                        isSelected ? 'text-black/80 font-semibold' : 'text-zinc-500'
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Size Selector (Mandatory Affordance: 1K, 2K, 4K) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                Resolution & Detail
              </label>
              <span className="text-[11px] text-zinc-400 font-medium">
                {imageSize} output resolution
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((item) => {
                const isSelected = imageSize === item.size;
                return (
                  <button
                    key={item.size}
                    type="button"
                    onClick={() => onImageSizeChange(item.size)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-sm'
                        : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs block font-bold text-white">{item.label}</span>
                    <span className="text-[10px] text-zinc-400 block">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
