export function px(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  col: string,
) {
  ctx.fillStyle = col;
  ctx.fillRect(x, y, w, h);
}

export const C = {
  BK: '#1a1a1a', YL: '#F9BD2B', CR: '#E5E7E0',
  GR: '#5a8a3c', GR2: '#4d7a32',
  PT: '#c8a96e', PT2: '#b8996e',
  WL: '#8B7355', WL2: '#7a6345',
  RF: '#c94040', RF2: '#a83030',
  HB: '#D4B896', HS: '#7a5c3a', HN: '#c4906a',
} as const;

export const TILE = 32;
export const COLS = 20;
export const ROWS = 15;
export const S    = 2;
