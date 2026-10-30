import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Map custom aspect ratios to closest valid model aspect ratios if needed
function normalizeAspectRatio(ratio: string): string {
  const allowed = ['1:1', '3:4', '4:3', '9:16', '16:9', '1:4', '1:8', '4:1', '8:1'];
  if (allowed.includes(ratio)) return ratio;
  if (ratio === '2:3') return '9:16';
  if (ratio === '3:2') return '16:9';
  if (ratio === '21:9') return '16:9';
  return '9:16';
}

// Helper to extract base64 data and mimeType
function parseImageData(rawImage: string): { data: string; mimeType: string } | null {
  if (!rawImage) return null;

  // Case 1: Data URL e.g. data:image/png;base64,iVBOR...
  if (rawImage.startsWith('data:')) {
    const match = rawImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (match) {
      return { mimeType: match[1], data: match[2] };
    }
  }

  // Case 2: Local file path in public directory e.g. /assets/aistudio/...
  if (rawImage.startsWith('/assets/') || rawImage.startsWith('public/')) {
    const cleanPath = rawImage.startsWith('/') ? rawImage.slice(1) : rawImage;
    const fullPath = path.join(__dirname, 'public', cleanPath.replace(/^public\//, '').replace(/^assets\//, 'assets/'));
    if (fs.existsSync(fullPath)) {
      const buffer = fs.readFileSync(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      const mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
      return { mimeType, data: buffer.toString('base64') };
    }
  }

  // Case 3: Raw base64 string
  if (rawImage.length > 100 && !rawImage.includes(' ')) {
    return { mimeType: 'image/jpeg', data: rawImage };
  }

  return null;
}

// Curated high-fidelity wallpaper templates for smooth fallbacks or instant generation preview
const PRESET_STYLES = [
  {
    theme: 'Atmospheric Mood',
    perspective: 'Atmospheric lighting, deep contrast reflections, fine raindrops and cinematic mood',
    colorA: '#0f172a',
    colorB: '#38bdf8',
    accent: '#f59e0b',
  },
  {
    theme: 'Cinematic Vista',
    perspective: 'Sweeping cinematic vista, volumetric golden ambient light, expansive depth',
    colorA: '#18181b',
    colorB: '#f97316',
    accent: '#fbbf24',
  },
  {
    theme: 'Dreamy Ethereal',
    perspective: 'Ethereal soft glow, delicate bokeh, dreamy pastel ambient gradients and clean lockscreen focus',
    colorA: '#1e1b4b',
    colorB: '#a855f7',
    accent: '#ec4899',
  },
  {
    theme: 'Bold Textural',
    perspective: 'Rich tactile textures, sharp geometric silhouettes, obsidian and neon highlights',
    colorA: '#09090b',
    colorB: '#10b981',
    accent: '#06b6d4',
  },
];

// Helper to generate a stylized high-res SVG wallpaper canvas fallback if API quota is 0 on free tier
function createAestheticSvgWallpaper(vibe: string, variationIndex: number, aspectRatio: string): string {
  const style = PRESET_STYLES[variationIndex % PRESET_STYLES.length];
  const [w, h] = aspectRatio === '9:16' ? [1080, 1920] : aspectRatio === '1:1' ? [1080, 1080] : [1080, 1920];
  
  // Seed hash from vibe and variation
  let hash = 0;
  for (let i = 0; i < vibe.length; i++) {
    hash = (hash << 5) - hash + vibe.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash) + variationIndex * 31;
  const hueShift = (seed % 60) - 30;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${style.colorA}" />
        <stop offset="50%" stop-color="#0b0e14" />
        <stop offset="100%" stop-color="${style.colorB}" />
      </linearGradient>
      <radialGradient id="orbGrad1" cx="35%" cy="30%" r="55%">
        <stop offset="0%" stop-color="${style.accent}" stop-opacity="0.85" />
        <stop offset="50%" stop-color="${style.colorB}" stop-opacity="0.3" />
        <stop offset="100%" stop-color="${style.colorA}" stop-opacity="0" />
      </radialGradient>
      <radialGradient id="orbGrad2" cx="70%" cy="75%" r="60%">
        <stop offset="0%" stop-color="${style.colorB}" stop-opacity="0.7" />
        <stop offset="100%" stop-color="transparent" stop-opacity="0" />
      </radialGradient>
      <filter id="blurFilter" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="90" />
      </filter>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.07 0" />
      </filter>
    </defs>

    <rect width="${w}" height="${h}" fill="url(#bgGrad)" />

    <!-- Ambient luminous spheres -->
    <circle cx="${w * 0.4}" cy="${h * 0.35}" r="${w * 0.45}" fill="url(#orbGrad1)" filter="url(#blurFilter)" />
    <circle cx="${w * 0.75}" cy="${h * 0.65}" r="${w * 0.5}" fill="url(#orbGrad2)" filter="url(#blurFilter)" />
    
    <!-- Stylized horizon mountain/landscape curves -->
    <path d="M0,${h * 0.65} Q${w * 0.25},${h * 0.58} ${w * 0.5},${h * 0.63} T${w},${h * 0.55} L${w},${h} L0,${h} Z" fill="#090b0f" opacity="0.85" />
    <path d="M0,${h * 0.72} Q${w * 0.35},${h * 0.68} ${w * 0.7},${h * 0.74} T${w},${h * 0.68} L${w},${h} L0,${h} Z" fill="#05070a" opacity="0.95" />

    <!-- Subtle atmospheric grid lines / neon horizon -->
    <line x1="0" y1="${h * 0.64}" x2="${w}" y2="${h * 0.64}" stroke="${style.accent}" stroke-width="2" opacity="0.3" />

    <!-- Organic starry mist particles -->
    <g opacity="0.6">
      <circle cx="${(seed * 17) % w}" cy="${(seed * 23) % (h * 0.5)}" r="3" fill="#fff" opacity="0.8" />
      <circle cx="${(seed * 41) % w}" cy="${(seed * 19) % (h * 0.5)}" r="2" fill="${style.accent}" opacity="0.9" />
      <circle cx="${(seed * 73) % w}" cy="${(seed * 53) % (h * 0.5)}" r="4" fill="#fff" opacity="0.6" />
      <circle cx="${(seed * 29) % w}" cy="${(seed * 89) % (h * 0.5)}" r="2" fill="${style.colorB}" opacity="0.8" />
    </g>

    <!-- Grain texture overlay -->
    <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.5" />

    <!-- Vibe watermark badge subtle -->
    <g transform="translate(60, ${h - 100})" opacity="0.4">
      <text font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="28" font-weight="600" fill="#ffffff" letter-spacing="4">
        ${vibe.toUpperCase().slice(0, 24)} • VAR ${variationIndex + 1}
      </text>
    </g>
  </svg>`;
}

// Generate single variation using Gemini API
async function generateSingleVariation({
  vibe,
  variationIndex,
  aspectRatio,
  imageSize,
  model,
  referenceImage,
  remixPrompt,
}: {
  vibe: string;
  variationIndex: number;
  aspectRatio: string;
  imageSize: string;
  model: string;
  referenceImage?: string;
  remixPrompt?: string;
}): Promise<{ imageUrl: string; variationTitle: string; fromGemini: boolean; error?: string }> {
  const variationMeta = PRESET_STYLES[variationIndex % PRESET_STYLES.length];
  const normalizedAspect = normalizeAspectRatio(aspectRatio);

  const parts: any[] = [];
  const parsedRef = referenceImage ? parseImageData(referenceImage) : null;

  if (parsedRef) {
    parts.push({
      inlineData: {
        data: parsedRef.data,
        mimeType: parsedRef.mimeType,
      },
    });
    const promptText = remixPrompt
      ? `Remix this phone wallpaper reference image: "${vibe}". Modification: ${remixPrompt}. Perspective: ${variationMeta.perspective}. Produce a clean, stunning wallpaper composition formatted for ${aspectRatio}.`
      : `Create an evolved variation of this wallpaper reference image inspired by the vibe: "${vibe}". Aesthetic angle: ${variationMeta.perspective}. Maintain aesthetic depth and create a gorgeous phone wallpaper.`;
    parts.push({ text: promptText });
  } else {
    parts.push({
      text: `Phone wallpaper of: ${vibe}. Perspective style: ${variationMeta.perspective}. Pristine phone wallpaper composition, balanced lockscreen contrast, high dynamic range, breathtaking aesthetics in ${aspectRatio} ratio.`,
    });
  }

  // Model selection: User requested gemini-3-pro-image-preview for studio quality
  const targetModel = model || 'gemini-3-pro-image-preview';

  try {
    const config: any = {
      imageConfig: {
        aspectRatio: normalizedAspect,
      },
    };

    if (imageSize && (imageSize === '1K' || imageSize === '2K' || imageSize === '4K')) {
      config.imageConfig.imageSize = imageSize;
    }

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: { parts },
      config,
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        const dataUrl = `data:${mime};base64,${part.inlineData.data}`;
        return {
          imageUrl: dataUrl,
          variationTitle: `${variationMeta.theme} (#${variationIndex + 1})`,
          fromGemini: true,
        };
      }
    }

    throw new Error('No image inlineData received from model response');
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    console.warn(`[Gemini Image API] Variation ${variationIndex + 1} call error:`, errMsg);

    // If quota was exceeded or free tier blocked, generate aesthetic procedural fallback
    const svg = createAestheticSvgWallpaper(vibe, variationIndex, normalizedAspect);
    const base64Svg = Buffer.from(svg).toString('base64');
    const fallbackUrl = `data:image/svg+xml;base64,${base64Svg}`;

    return {
      imageUrl: fallbackUrl,
      variationTitle: `${variationMeta.theme} (#${variationIndex + 1})`,
      fromGemini: false,
      error: errMsg.includes('429') || errMsg.includes('quota') ? 'Quota exceeded on Free Tier. Select a paid API key to unlock full 4K Gemini generation.' : errMsg,
    };
  }
}

// Main API Route: Generate 4 variations
app.post('/api/generate-wallpapers', async (req, res) => {
  try {
    const {
      vibe = 'rainy cyberpunk lo-fi',
      aspectRatio = '9:16',
      imageSize = '1K',
      model = 'gemini-3-pro-image-preview',
      referenceImage,
      remixPrompt,
    } = req.body;

    console.log(`[Generate Request] Vibe: "${vibe}", Model: ${model}, Aspect: ${aspectRatio}, Size: ${imageSize}, HasRef: ${!!referenceImage}`);

    // Generate 4 distinct variations concurrently
    const variationsPromises = [0, 1, 2, 3].map((index) =>
      generateSingleVariation({
        vibe,
        variationIndex: index,
        aspectRatio,
        imageSize,
        model,
        referenceImage,
        remixPrompt,
      })
    );

    const results = await Promise.all(variationsPromises);

    const hasAnyGemini = results.some((r) => r.fromGemini);
    const quotaError = results.find((r) => r.error?.includes('Quota') || r.error?.includes('429'))?.error;

    return res.json({
      success: true,
      vibe,
      aspectRatio,
      imageSize,
      model,
      variations: results.map((r, i) => ({
        id: `var-${Date.now()}-${i}`,
        url: r.imageUrl,
        title: r.variationTitle,
        aspectRatio,
        imageSize,
        model,
        fromGemini: r.fromGemini,
      })),
      quotaExceeded: !hasAnyGemini && !!quotaError,
      errorMessage: quotaError || (hasAnyGemini ? null : 'API rate limited. Displaying styled preview variations.'),
    });
  } catch (error: any) {
    console.error('API /api/generate-wallpapers failed:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate wallpapers',
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VibePaper Server] running on http://0.0.0.0:${PORT} (isDev: ${isDev})`);
  });
}

startServer();
