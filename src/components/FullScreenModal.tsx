import React, { useState } from 'react';
import {
  X,
  Download,
  Sparkles,
  Smartphone,
  Eye,
  Info,
  Check,
  Share2,
  ChevronDown,
} from 'lucide-react';
import { WallpaperVariation } from '../types';
import { PhoneSimulatorOverlay } from './PhoneSimulatorOverlay';

interface FullScreenModalProps {
  wallpaper: WallpaperVariation | null;
  onClose: () => void;
  onRemix: (wallpaper: WallpaperVariation, remixText?: string) => void;
}

export const FullScreenModal: React.FC<FullScreenModalProps> = ({
  wallpaper,
  onClose,
  onRemix,
}) => {
  if (!wallpaper) return null;

  const [overlayMode, setOverlayMode] = useState<'lockscreen' | 'homescreen' | 'clean'>('lockscreen');
  const [showDetails, setShowDetails] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [remixCustomText, setRemixCustomText] = useState('');
  const [showRemixInput, setShowRemixInput] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const filename = `vibepaper-${wallpaper.vibe.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30)}-${wallpaper.aspectRatio.replace(':', 'x')}.png`;

      // If it's already a data URL
      if (wallpaper.url.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = wallpaper.url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        // Fetch blob for cross-origin or local public images
        const response = await fetch(wallpaper.url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback direct link
      window.open(wallpaper.url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const handleStartRemix = () => {
    onRemix(wallpaper, remixCustomText.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center animate-fadeIn p-0 sm:p-4 overflow-hidden">
      {/* Top action bar */}
      <div className="absolute top-3 left-3 right-3 z-40 flex items-center justify-between text-white pointer-events-auto">
        <button
          onClick={onClose}
          aria-label="Close full screen"
          className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/80 transition-all text-white shadow-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          {/* Info toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`h-10 px-3 rounded-full backdrop-blur-md border flex items-center space-x-1.5 text-xs font-semibold transition-all ${
              showDetails
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-black/60 border-white/20 text-zinc-300 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">Details</span>
          </button>
        </div>
      </div>

      {/* Main Center Phone Container */}
      <div className="relative w-full h-full max-w-[420px] max-h-[880px] sm:rounded-[40px] overflow-hidden shadow-2xl flex flex-col justify-center items-center bg-[#07090c] border sm:border-zinc-800">
        {/* The Wallpaper Image */}
        <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
          <img
            src={wallpaper.url}
            alt={wallpaper.title}
            className="w-full h-full object-cover select-none"
          />

          {/* Interactive Phone Simulator Overlay (Clock, Notifications, App Icons) */}
          <PhoneSimulatorOverlay
            mode={overlayMode}
            onModeChange={setOverlayMode}
            title={wallpaper.title}
          />
        </div>

        {/* Details Drawer if opened */}
        {showDetails && (
          <div className="absolute top-16 inset-x-4 bg-black/90 backdrop-blur-xl border border-white/15 rounded-2xl p-4 text-white z-40 animate-slideDown shadow-2xl">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-bold text-amber-400">Wallpaper Metadata</h3>
              <button onClick={() => setShowDetails(false)} className="text-zinc-400 hover:text-white">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-zinc-300 mb-3 line-clamp-2 italic">"{wallpaper.vibe}"</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Ratio</span>
                <span className="font-mono text-zinc-100 font-medium">{wallpaper.aspectRatio} (Phone)</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Quality</span>
                <span className="font-mono text-zinc-100 font-medium">{wallpaper.imageSize} Studio UHD</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg border border-white/5 col-span-2">
                <span className="text-zinc-400 block text-[10px] uppercase font-semibold">Engine</span>
                <span className="font-mono text-amber-300 font-medium text-[11px] truncate block">
                  {wallpaper.model}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Remix drawer popup */}
        {showRemixInput && (
          <div className="absolute bottom-24 inset-x-4 bg-zinc-900/95 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-4 z-40 text-white shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-400 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Remix Modifier (Optional)</span>
              </span>
              <button onClick={() => setShowRemixInput(false)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={remixCustomText}
              onChange={(e) => setRemixCustomText(e.target.value)}
              placeholder="e.g. switch to midnight rain, add purple neon..."
              className="w-full bg-black/70 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 mb-3"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleStartRemix}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Remix 4 Variations</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Floating Action Bar: Download & Remix Buttons */}
        <div className="absolute bottom-3 left-4 right-4 z-40 flex items-center space-x-3 pointer-events-auto">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 h-12 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-xl border border-white/20 flex items-center justify-center space-x-2 text-white font-semibold text-sm transition-all shadow-xl"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Saved!</span>
              </>
            ) : (
              <>
                <Download className={`w-4 h-4 ${downloading ? 'animate-bounce' : ''}`} />
                <span>Download</span>
              </>
            )}
          </button>

          {/* Remix Button */}
          <button
            onClick={() => setShowRemixInput(!showRemixInput)}
            className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-black font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/30 transition-all border border-amber-300/40"
          >
            <Sparkles className="w-4 h-4 fill-black/20" />
            <span>Remix</span>
          </button>
        </div>
      </div>
    </div>
  );
};
