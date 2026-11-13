export type ColorScheme = 'light' | 'dark';

export type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textFaint: string;
  primary: string;
  primaryText: string;
  primarySoft: string;
  success: string;
  danger: string;
  overlay: string;
};

export const palettes: Record<ColorScheme, Palette> = {
  dark: {
    bg: '#0A0B11',
    surface: '#13141C',
    surfaceAlt: '#1A1C27',
    border: '#252837',
    text: '#F5F5FA',
    textMuted: '#9A9EB2',
    textFaint: '#666A7E',
    primary: '#8B6CF0',
    primaryText: '#FFFFFF',
    primarySoft: '#8B6CF026',
    success: '#4ADE9E',
    danger: '#F26D7D',
    overlay: '#000000AA',
  },
  light: {
    bg: '#F5F5FA',
    surface: '#FFFFFF',
    surfaceAlt: '#EEEEF6',
    border: '#E1E1EC',
    text: '#14141C',
    textMuted: '#5D6074',
    textFaint: '#8C8FA2',
    primary: '#6C4AE0',
    primaryText: '#FFFFFF',
    primarySoft: '#6C4AE01A',
    success: '#15A66B',
    danger: '#D93F55',
    overlay: '#00000066',
  },
};

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28 } as const;
export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 } as const;

export const type = {
  eyebrow: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.6 },
  title: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.8, lineHeight: 37 },
  heading: { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.2 },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 21 },
  label: { fontSize: 14, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 17 },
};

const HEX6 = /^#[0-9A-Fa-f]{6}$/;

const toRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, '0');

/** Blend colour `a` towards `b` by `t` (0..1). Invalid input is returned unchanged. */
export function mix(a: string, b: string, t: number): string {
  if (!HEX6.test(a) || !HEX6.test(b)) return a;
  const [ar, ag, ab] = toRgb(a);
  const [br, bg, bb] = toRgb(b);
  return `#${toHex(ar + (br - ar) * t)}${toHex(ag + (bg - ag) * t)}${toHex(ab + (bb - ab) * t)}`.toUpperCase();
}

/** Returns an 8-digit hex colour with the given alpha (0..1). */
export function withAlpha(hex: string, alpha: number): string {
  if (!HEX6.test(hex)) return hex;
  return `${hex}${toHex(alpha * 255)}`.toUpperCase();
}

/** Picks a readable foreground (white or near-black) for a background colour. */
export function readableOn(hex: string): string {
  if (!HEX6.test(hex)) return '#FFFFFF';
  const [r, g, b] = toRgb(hex);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#14141C' : '#FFFFFF';
}

export const isHex6 = (value: unknown): value is string => typeof value === 'string' && HEX6.test(value);
