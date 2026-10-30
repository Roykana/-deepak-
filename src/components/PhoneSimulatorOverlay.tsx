import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Camera, Flashlight, Music, Sparkles } from 'lucide-react';

interface PhoneSimulatorOverlayProps {
  mode: 'lockscreen' | 'homescreen' | 'clean';
  onModeChange: (mode: 'lockscreen' | 'homescreen' | 'clean') => void;
  title?: string;
}

export const PhoneSimulatorOverlay: React.FC<PhoneSimulatorOverlayProps> = ({
  mode,
  onModeChange,
  title,
}) => {
  const [time, setTime] = useState('09:41');
  const [dateStr, setDateStr] = useState('Friday, October 30');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);

      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      };
      setDateStr(now.toLocaleDateString(undefined, options));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 select-none z-20">
      {/* Top Status Bar & Island */}
      <div className="w-full flex items-center justify-between text-white text-xs font-semibold tracking-wide drop-shadow-md pt-2 px-2">
        <span className="font-bold tracking-tight text-sm drop-shadow">{time}</span>

        {/* Dynamic Island pill */}
        <div className="h-6 w-24 bg-black/85 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 shadow-lg">
          <div className="h-2 w-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          <span className="text-[10px] text-zinc-300 font-mono">9:16 UHD</span>
        </div>

        {/* System icons */}
        <div className="flex items-center space-x-1.5 drop-shadow">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <BatteryMedium className="w-4 h-4" />
        </div>
      </div>

      {/* Main Lockscreen Content */}
      {mode === 'lockscreen' && (
        <div className="flex-1 flex flex-col items-center justify-start pt-10 text-center animate-fadeIn">
          {/* Subtle date */}
          <p className="text-zinc-200 text-sm font-medium tracking-wide drop-shadow-lg mb-1">
            {dateStr}
          </p>

          {/* Large Hero Lockscreen Clock */}
          <h1 className="text-7xl font-extralight tracking-tight text-white drop-shadow-2xl font-[Plus_Jakarta_Sans]">
            {time}
          </h1>

          {/* Interactive Music / Vibe Widget */}
          <div className="mt-8 bg-black/40 backdrop-blur-xl border border-white/15 px-4 py-2.5 rounded-2xl flex items-center space-x-3 shadow-2xl max-w-[280px]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
              <Music className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                Vibe Player
              </p>
              <p className="text-xs text-white font-medium truncate">
                {title || 'Lo-fi Ambient Dreams'}
              </p>
            </div>
            <div className="flex items-center space-x-0.5">
              <div className="w-0.5 h-3 bg-amber-400 animate-pulse rounded-full" />
              <div className="w-0.5 h-5 bg-amber-400 animate-pulse delay-75 rounded-full" />
              <div className="w-0.5 h-2 bg-amber-400 animate-pulse delay-150 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Homescreen simulated apps grid */}
      {mode === 'homescreen' && (
        <div className="flex-1 flex flex-col justify-between pt-12 pb-16 animate-fadeIn">
          {/* App grid */}
          <div className="grid grid-cols-4 gap-y-6 gap-x-4 px-2">
            {[
              { name: 'VibePaper', bg: 'from-amber-500 to-orange-600', icon: '✨' },
              { name: 'Photos', bg: 'from-blue-500 to-cyan-500', icon: '🌄' },
              { name: 'Camera', bg: 'from-zinc-700 to-zinc-900', icon: '📷' },
              { name: 'Music', bg: 'from-rose-500 to-pink-600', icon: '🎵' },
              { name: 'Settings', bg: 'from-slate-600 to-slate-800', icon: '⚙️' },
              { name: 'Remix AI', bg: 'from-purple-600 to-indigo-600', icon: '⚡' },
              { name: 'Maps', bg: 'from-emerald-500 to-teal-600', icon: '🗺️' },
              { name: 'Studio', bg: 'from-amber-600 to-yellow-500', icon: '🎨' },
            ].map((app, i) => (
              <div key={i} className="flex flex-col items-center space-y-1">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.bg} flex items-center justify-center text-xl shadow-lg border border-white/20`}
                >
                  {app.icon}
                </div>
                <span className="text-[10px] text-white font-medium drop-shadow-md truncate max-w-[50px]">
                  {app.name}
                </span>
              </div>
            ))}
          </div>

          {/* Homescreen Dock */}
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-3 flex justify-around items-center shadow-2xl mx-1">
            {['💬', '🌐', '✉️', '📞'].map((emoji, idx) => (
              <div
                key={idx}
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-white/20 to-white/5 border border-white/20 flex items-center justify-center text-xl shadow-md"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clean Mode (unobstructed art) */}
      {mode === 'clean' && <div className="flex-1" />}

      {/* Bottom Controls / Lockscreen shortcuts & Home indicator */}
      <div className="w-full flex flex-col items-center space-y-3">
        {mode === 'lockscreen' && (
          <div className="w-full flex justify-between items-center px-4">
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-xl">
              <Flashlight className="w-5 h-5 drop-shadow" />
            </div>
            <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white shadow-xl">
              <Camera className="w-5 h-5 drop-shadow" />
            </div>
          </div>
        )}

        {/* Home bar */}
        <div className="w-32 h-1 bg-white/75 rounded-full shadow-lg" />
      </div>

      {/* Mode switcher tabs (Interactive layer positioned at bottom) */}
      <div className="pointer-events-auto absolute bottom-7 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl border border-white/15 p-1 rounded-full flex items-center space-x-1 shadow-2xl z-30">
        <button
          onClick={() => onModeChange('lockscreen')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            mode === 'lockscreen'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Lockscreen
        </button>
        <button
          onClick={() => onModeChange('homescreen')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            mode === 'homescreen'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Homescreen
        </button>
        <button
          onClick={() => onModeChange('clean')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
            mode === 'clean'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Artwork
        </button>
      </div>
    </div>
  );
};
