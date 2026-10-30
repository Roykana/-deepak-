import { PresetVibe, WallpaperVariation } from '../types';

export const USER_ATTACHMENT_PATH = '/assets/aistudio/WhatsApp_Image_2026-10-30_at_4.37.15_PM_8e8f4392.jpeg';

export const PRESET_VIBES: PresetVibe[] = [
  {
    id: 'rainy-cyberpunk',
    title: 'Rainy Cyberpunk',
    vibe: 'rainy cyberpunk lo-fi alley with neon reflections in puddles and soft steam',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    badge: 'Popular',
    color: 'from-amber-500 via-orange-500 to-rose-500',
  },
  {
    id: 'golden-peaks',
    title: 'Golden Peaks',
    vibe: 'cinematic sunset mountain peaks with hiker silhouette, warm amber glow and misty valleys',
    thumbnail: USER_ATTACHMENT_PATH,
    badge: 'Trending',
    color: 'from-amber-400 via-orange-500 to-amber-700',
  },
  {
    id: 'tokyo-neon',
    title: 'Tokyo Dusk',
    vibe: 'tokyo shinjuku narrow street at dusk with paper lanterns and soft rain drizzle',
    thumbnail: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80',
    badge: 'Moody',
    color: 'from-cyan-500 via-blue-600 to-indigo-800',
  },
  {
    id: 'ethereal-dunes',
    title: 'Pastel Dunes',
    vibe: 'minimalist surreal desert sand dunes with pastel purple gradient sky and lone palm silhouette',
    thumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80',
    badge: 'Minimal',
    color: 'from-rose-400 via-purple-500 to-indigo-600',
  },
  {
    id: 'deep-nebula',
    title: 'Cosmic Nebula',
    vibe: 'deep space vibrant celestial nebula with glowing star dust and obsidian planet rings',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
    badge: '4K Sci-Fi',
    color: 'from-purple-500 via-indigo-600 to-sky-500',
  },
  {
    id: 'pine-fog',
    title: 'Emerald Pine',
    vibe: 'dense scandinavian pine forest shrouded in atmospheric morning mist and dew drops',
    thumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80',
    badge: 'Nature',
    color: 'from-emerald-500 via-teal-600 to-cyan-700',
  },
];

export const STARTER_VARIATIONS: WallpaperVariation[] = [
  {
    id: 'starter-1',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1080&q=85',
    title: 'Atmospheric Rain (#1)',
    vibe: 'rainy cyberpunk lo-fi alley with neon reflections in puddles',
    aspectRatio: '9:16',
    imageSize: '4K',
    model: 'gemini-3-pro-image-preview',
    createdAt: Date.now() - 3600000,
    fromGemini: true,
  },
  {
    id: 'starter-2',
    url: USER_ATTACHMENT_PATH,
    title: 'Golden Sunset Silhouette (#2)',
    vibe: 'warm amber sunset overlooking layered mountain ridgelines with traveler silhouette',
    aspectRatio: '9:16',
    imageSize: '4K',
    model: 'gemini-3-pro-image-preview',
    createdAt: Date.now() - 3000000,
    fromGemini: true,
  },
  {
    id: 'starter-3',
    url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1080&q=85',
    title: 'Neon Dusk Canopy (#3)',
    vibe: 'rainy cyberpunk lo-fi with glowing signs and misty depth',
    aspectRatio: '9:16',
    imageSize: '4K',
    model: 'gemini-3-pro-image-preview',
    createdAt: Date.now() - 2400000,
    fromGemini: true,
  },
  {
    id: 'starter-4',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1080&q=85',
    title: 'Ethereal Star Horizon (#4)',
    vibe: 'surreal twilight horizon with gradient night sky and quiet serene reflections',
    aspectRatio: '9:16',
    imageSize: '4K',
    model: 'gemini-3-pro-image-preview',
    createdAt: Date.now() - 1800000,
    fromGemini: true,
  },
];

export const VIBE_PROMPTS_POOL = [
  'rainy cyberpunk lo-fi street with neon reflections in puddles',
  'ethereal golden sunset over foggy mountain summits with quiet silhouette',
  'minimalist obsidian and rose gold fluid abstract geometry',
  'japanese tea garden in autumn rain with glowing stone lanterns',
  'cyberpunk shinjuku rooftops with holographic advertisements in fog',
  'dreamy lo-fi bedroom window overlooking rainy tokyo skyline at 3 AM',
  'deep underwater bioluminescent coral reef with tranquil turquoise glow',
  'solitary astronaut gazing at a twin ringed planet in a violet nebula',
];
