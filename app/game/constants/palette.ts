export const PALETTE = {
  cream:  '#E5E7E0',
  yellow: '#F9BD2B',
  black:  '#1a1a1a',
  green:  '#5a8a3c',
  dirt:   '#c8a96e',
  brown:  '#8B7355',
  red:    '#c94040',
  dusk:   '#6B6B8A',
  shadow: '#2a2a4a',
} as const;

export type PaletteKey = keyof typeof PALETTE;
