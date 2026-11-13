export type KeyboardTheme = {
  id: string;
  name: string;
  description: string;
  background: string;
  key: string;
  text: string;
  accent: string;
  radius: number;
};

/** Curated palettes are intentionally dependency-free and work in the preview and editor. */
export const themes: KeyboardTheme[] = [
  {
    id: 'midnight-violet',
    name: 'Midnight Violet',
    description: 'Signature NexKey purple on a deep night base',
    background: '#171523',
    key: '#29263A',
    text: '#F6F2FF',
    accent: '#9475FF',
    radius: 10,
  },
  {
    id: 'obsidian-luxe',
    name: 'Obsidian Luxe',
    description: 'Velvet black with a subtle champagne accent',
    background: '#111114',
    key: '#252329',
    text: '#F7F3EA',
    accent: '#C6A978',
    radius: 9,
  },
  {
    id: 'amethyst-glow',
    name: 'Amethyst Glow',
    description: 'Rich plum shades with a luminous violet finish',
    background: '#1D1428',
    key: '#352442',
    text: '#FAF1FF',
    accent: '#B47AFF',
    radius: 13,
  },
  {
    id: 'arctic-blue',
    name: 'Arctic Blue',
    description: 'Cool blue accents on a midnight base',
    background: '#101B2A',
    key: '#1D3045',
    text: '#ECF7FF',
    accent: '#54B8F2',
    radius: 8,
  },
  {
    id: 'rose-noir',
    name: 'Rose Noir',
    description: 'Muted rose details with a dark finish',
    background: '#21151D',
    key: '#38232F',
    text: '#FFF0F6',
    accent: '#E17AA9',
    radius: 13,
  },
  {
    id: 'aurora-teal',
    name: 'Aurora Teal',
    description: 'Deep ocean tones with a fresh teal highlight',
    background: '#101D20',
    key: '#1E3437',
    text: '#E9FFFC',
    accent: '#55D6C2',
    radius: 11,
  },
  {
    id: 'porcelain',
    name: 'Soft Porcelain',
    description: 'A calm light palette with elegant violet details',
    background: '#E9E7F1',
    key: '#FFFFFF',
    text: '#242132',
    accent: '#7657D8',
    radius: 10,
  },
  {
    id: 'mono',
    name: 'Monochrome',
    description: 'Timeless black, graphite and white contrast',
    background: '#171717',
    key: '#303030',
    text: '#FFFFFF',
    accent: '#A5A5B2',
    radius: 6,
  },
];
