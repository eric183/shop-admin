export interface ISanityDocument {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  assetId: string;
  extension: string;
  metadata: Metadata;
  mimeType: string;
  originalFilename: string;
  path: string;
  sha1hash: string;
  size: number;
  uploadId: string;
  url: string;
}

export interface Metadata {
  _type: string;
  blurHash: string;
  dimensions: Dimensions;
  hasAlpha: boolean;
  isOpaque: boolean;
  lqip: string;
  palette: Palette;
}

export interface Dimensions {
  _type: string;
  aspectRatio: number;
  height: number;
  width: number;
}

export interface Palette {
  _type: string;
  darkMuted: DarkMuted;
  darkVibrant: DarkMuted;
  dominant: DarkMuted;
  lightMuted: DarkMuted;
  lightVibrant: DarkMuted;
  muted: DarkMuted;
  vibrant: DarkMuted;
}

export interface DarkMuted {
  _type: string;
  background: string;
  foreground: string;
  population: number;
  title: string;
}
