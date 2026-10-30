export type AspectRatio =
  | '9:16'
  | '1:1'
  | '2:3'
  | '3:2'
  | '3:4'
  | '4:3'
  | '16:9'
  | '21:9';

export type ImageSize = '1K' | '2K' | '4K';

export type ModelType = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export interface WallpaperVariation {
  id: string;
  url: string;
  title: string;
  vibe: string;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  model: ModelType;
  createdAt: number;
  fromGemini?: boolean;
  referenceImage?: string;
  isFavorite?: boolean;
}

export interface PresetVibe {
  id: string;
  title: string;
  vibe: string;
  thumbnail: string;
  badge: string;
  color: string;
}
