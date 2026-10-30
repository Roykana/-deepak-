import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Download,
  RefreshCw,
  Dices,
  Smartphone,
  Eye,
  Layers,
  X,
  Sliders,
  Share2,
  Check,
  AlertCircle,
  Flame,
  ArrowRight,
  Maximize2,
  Heart,
  Image as ImageIcon,
} from 'lucide-react';
import { AspectRatio, ImageSize, ModelType, WallpaperVariation, PresetVibe } from './types';
import { STARTER_VARIATIONS, VIBE_PROMPTS_POOL, USER_ATTACHMENT_PATH } from './data/presetVibes';
import { FullScreenModal } from './components/FullScreenModal';
import { SettingsBar } from './components/SettingsBar';
import { VibeStories } from './components/VibeStories';

export default function App() {
  // Input states
  const [vibe, setVibe] = useState('rainy cyberpunk lo-fi');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [imageSize, setImageSize] = useState<ImageSize>('4K');
  const [model, setModel] = useState<ModelType>('gemini-3-pro-image-preview');

  // Reference image for remixing
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceTitle, setReferenceTitle] = useState<string | null>(null);
  const [remixNote, setRemixNote] = useState<string | null>(null);

  // Generation status & variations
  const [isGenerating, setIsGenerating] = useState(false);
  const [variations, setVariations] = useState<WallpaperVariation[]>(STARTER_VARIATIONS);
  const [history, setHistory] = useState<WallpaperVariation[]>(STARTER_VARIATIONS);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'favorites'>('current');

  // UI modal & view toggles
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperVariation | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [phoneFrameMode, setPhoneFrameMode] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quotaWarning, setQuotaWarning] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Surprise me vibe picker
  const handleRandomVibe = () => {
    const available = VIBE_PROMPTS_POOL.filter((p) => p !== vibe);
    const random = available[Math.floor(Math.random() * available.length)];
    setVibe(random);
    setReferenceImage(null);
    setRemixNote(null);
  };

  // Story click handler
  const handleSelectStoryVibe = (preset: PresetVibe) => {
    setVibe(preset.vibe);
    setReferenceImage(null);
    setRemixNote(null);
    inputRef.current?.focus();
  };

  // Generate 4 Variations handler
  const handleGenerate = async (overrideVibe?: string, customRef?: string, customRemixText?: string) => {
    const targetVibe = overrideVibe || vibe;
    if (!targetVibe.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setQuotaWarning(null);

    const refToUse = customRef !== undefined ? customRef : referenceImage;
    const remixTextToUse = customRemixText !== undefined ? customRemixText : remixNote;

    try {
      const response = await fetch('/api/generate-wallpapers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vibe: targetVibe,
          aspectRatio,
          imageSize,
          model,
          referenceImage: refToUse,
          remixPrompt: remixTextToUse,
        }),
      });

      const data = await response.json();

      if (data.success && data.variations && data.variations.length > 0) {
        const newBatch: WallpaperVariation[] = data.variations.map((v: any) => ({
          id: v.id,
          url: v.url,
          title: v.title,
          vibe: targetVibe,
          aspectRatio: v.aspectRatio,
          imageSize: v.imageSize,
          model: v.model,
          createdAt: Date.now(),
          fromGemini: v.fromGemini,
          referenceImage: refToUse || undefined,
        }));

        setVariations(newBatch);
        setHistory((prev) => [...newBatch, ...prev]);

        if (data.quotaExceeded) {
          setQuotaWarning(data.errorMessage);
        }
      } else {
        setErrorMessage(data.error || 'Could not generate wallpapers. Please try again.');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage('Network error while requesting wallpaper variations.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Remix trigger from card or full-screen view
  const handleRemix = (wallpaper: WallpaperVariation, customRemixText?: string) => {
    setReferenceImage(wallpaper.url);
    setReferenceTitle(wallpaper.title);
    if (customRemixText) {
      setRemixNote(customRemixText);
      setVibe(`${wallpaper.vibe} (${customRemixText})`);
    } else {
      setRemixNote('Alternate lighting & artistic evolution');
    }

    // Scroll to input and trigger remix generation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    handleGenerate(wallpaper.vibe, wallpaper.url, customRemixText);
  };

  const handleClearRemix = () => {
    setReferenceImage(null);
    setReferenceTitle(null);
    setRemixNote(null);
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const displayedWallpapers =
    activeTab === 'current'
      ? variations
      : activeTab === 'history'
      ? history
      : history.filter((w) => favorites.includes(w.id));

  return (
    <div className="min-h-screen bg-[#090b0e] text-[#f1f3f7] flex flex-col items-center">
      {/* Outer Shell: Mobile-First Canvas */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          phoneFrameMode
            ? 'max-w-[440px] min-h-screen border-x border-zinc-800/80 bg-[#0c0e14] shadow-2xl relative'
            : 'max-w-4xl min-h-screen px-4 bg-[#0c0e14]'
        }`}
      >
        {/* Sticky App Header */}
        <header className="sticky top-0 z-30 bg-[#0c0e14]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            {/* Glowing Brand Mark */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40">
              <Sparkles className="w-4 h-4 text-black fill-black" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-sm font-extrabold tracking-tight text-white font-[Plus_Jakarta_Sans]">
                  VIBEPAPER
                </h1>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                  9:16
                </span>
              </div>
              <p className="text-[10px] text-zinc-400">AI Phone Wallpaper Studio</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Frame toggle button */}
            <button
              onClick={() => setPhoneFrameMode(!phoneFrameMode)}
              title={phoneFrameMode ? 'Switch to Wide Desktop View' : 'Switch to Mobile Phone View'}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* Quick settings gear toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl border transition-all ${
                showSettings
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 pb-24 overflow-y-auto">
          {/* Vibe Story Circles (Ref Image Inspired) */}
          <VibeStories onSelectVibe={handleSelectStoryVibe} />

          {/* Generator Controls Drawer */}
          <SettingsBar
            aspectRatio={aspectRatio}
            onAspectRatioChange={setAspectRatio}
            imageSize={imageSize}
            onImageSizeChange={setImageSize}
            model={model}
            onModelChange={setModel}
            isOpen={showSettings}
            onToggle={() => setShowSettings(!showSettings)}
          />

          {/* Active Remix Banner if reference is attached */}
          {referenceImage && (
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-950/60 via-zinc-900/90 to-zinc-900/90 border border-amber-500/40 rounded-2xl flex items-center justify-between shadow-xl animate-slideDown">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-12 h-16 rounded-lg overflow-hidden border border-amber-400/50 shadow-md flex-shrink-0 bg-black">
                  <img src={referenceImage} alt="Remix source" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      Remix Active
                    </span>
                    <span className="text-[9px] px-1 bg-amber-400/20 text-amber-300 rounded">
                      Seed Base
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium truncate">
                    {referenceTitle || 'Current Wallpaper'}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    Using this artwork as reference for next 4 variations
                  </p>
                </div>
              </div>

              <button
                onClick={handleClearRemix}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-zinc-300 hover:text-white transition-colors ml-2"
                title="Cancel Remix Reference"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Main Prompt Input Box */}
          <div className="relative mb-5">
            <div className="relative rounded-2xl bg-[#12151c] border border-white/15 focus-within:border-amber-400 shadow-2xl transition-all p-1">
              <div className="flex items-center px-3 py-2">
                <Sparkles className="w-4 h-4 text-amber-400 mr-2.5 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={vibe}
                  onChange={(e) => setVibe(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="Describe your desired wallpaper vibe..."
                  className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-medium"
                />

                {/* Random Prompt Button */}
                <button
                  onClick={handleRandomVibe}
                  type="button"
                  title="Random Vibe Idea"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-white/5 transition-colors ml-1"
                >
                  <Dices className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons below input */}
              <div className="px-2 pb-2 pt-1 flex items-center justify-between border-t border-white/5">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] text-zinc-400 font-mono px-2 py-0.5 rounded-md bg-white/5">
                    {aspectRatio}
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                    {imageSize} UHD
                  </span>
                </div>

                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !vibe.trim()}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-black font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating 4 Variations...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 fill-black/30" />
                      <span>{referenceImage ? 'Remix 4 Variations' : 'Generate 4 Variations'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quota / Billing Notice if applicable */}
          {quotaWarning && (
            <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Free Tier Limit Note</p>
                <p className="text-[11px] text-amber-200/80 mt-0.5 leading-relaxed">
                  {quotaWarning} Procedural studio previews are displayed below. To enable full 4K output on Gemini, attach a billing-enabled key in Settings &gt; Secrets.
                </p>
              </div>
            </div>
          )}

          {/* Error notice */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Segment Navigation Tabs */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex space-x-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'current'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                4 Variations
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'history'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                History ({history.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1 ${
                  activeTab === 'favorites'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Heart className="w-3 h-3" />
                <span>Favorites ({favorites.length})</span>
              </button>
            </div>

            <span className="text-[11px] text-zinc-500 font-medium">Tap card for Fullscreen</span>
          </div>

          {/* Loading Skeletons */}
          {isGenerating && (
            <div className="grid grid-cols-2 gap-3 mb-6 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-[9/16] rounded-2xl bg-zinc-900 border border-amber-500/20 p-3 flex flex-col justify-between relative overflow-hidden shadow-xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-white/5 to-transparent animate-shimmer" />
                  <div className="flex justify-between items-center z-10">
                    <div className="h-4 w-16 bg-white/10 rounded-full" />
                    <div className="h-4 w-10 bg-amber-500/20 rounded-full" />
                  </div>
                  <div className="flex flex-col items-center justify-center space-y-2 z-10">
                    <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                    <span className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase">
                      Rendering Var #{i}
                    </span>
                  </div>
                  <div className="h-3 w-24 bg-white/10 rounded-full z-10" />
                </div>
              ))}
            </div>
          )}

          {/* 4 Wallpaper Variations Grid (9:16 Aspect Ratio) */}
          {!isGenerating && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {displayedWallpapers.map((wallpaper, idx) => {
                const isFav = favorites.includes(wallpaper.id);
                return (
                  <div
                    key={wallpaper.id}
                    onClick={() => setSelectedWallpaper(wallpaper)}
                    className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-white/10 hover:border-amber-400/60 transition-all duration-300 shadow-xl cursor-pointer hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between p-2.5 select-none"
                  >
                    {/* The Background Image */}
                    <img
                      src={wallpaper.url}
                      alt={wallpaper.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient vignettes for top & bottom readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

                    {/* Top Badges */}
                    <div className="relative z-10 flex items-center justify-between w-full">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-300 border border-white/10">
                        {wallpaper.aspectRatio}
                      </span>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(wallpaper.id, e)}
                        className={`w-7 h-7 rounded-full backdrop-blur-md border flex items-center justify-center transition-all ${
                          isFav
                            ? 'bg-rose-500 border-rose-400 text-white shadow-md'
                            : 'bg-black/50 border-white/15 text-zinc-300 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                      </button>
                    </div>

                    {/* Center Tap to Preview Indicator (reveals on hover/touch) */}
                    <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-amber-400 flex items-center justify-center text-amber-400 shadow-xl">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] text-white font-semibold mt-1 drop-shadow-md">
                        Preview Fullscreen
                      </span>
                    </div>

                    {/* Bottom Metadata & Quick Actions */}
                    <div className="relative z-10 w-full">
                      <p className="text-xs font-bold text-white drop-shadow truncate">
                        {wallpaper.title}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-zinc-300 drop-shadow font-mono">
                          {wallpaper.imageSize} UHD
                        </span>

                        {/* Quick Remix trigger button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemix(wallpaper);
                          }}
                          title="Remix this wallpaper"
                          className="px-2 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/50 backdrop-blur-md border border-amber-400/40 text-[10px] font-bold text-amber-200 flex items-center space-x-1 transition-all"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          <span>Remix</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick tips footer */}
          <div className="mt-4 p-3 rounded-2xl bg-[#12151c]/60 border border-white/5 text-center text-xs text-zinc-500">
            <p className="font-medium text-zinc-400">💡 Pro Tips</p>
            <p className="text-[11px] mt-1">
              Tap any wallpaper to test it against live Phone Lockscreen and Homescreen app grids! Hit "Remix" to evolve it with custom light, weather, or art styles.
            </p>
          </div>
        </main>
      </div>

      {/* Full-Screen Wallpaper Modal with Download & Remix */}
      <FullScreenModal
        wallpaper={selectedWallpaper}
        onClose={() => setSelectedWallpaper(null)}
        onRemix={handleRemix}
      />
    </div>
  );
}
