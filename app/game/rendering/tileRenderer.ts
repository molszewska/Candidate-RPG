import { px, C, TILE } from './utils';
import { T, TI } from '../data/maps';
import type { Area, MapGrid } from '../data/maps';

const ROWS = 15, COLS = 20;

export function drawTile(ctx: CanvasRenderingContext2D, tx: number, ty: number, tileId: number) {
  const bx = tx * TILE, by = ty * TILE, t = tileId;

  if (t === T.ROAD) {
    px(ctx, bx, by, TILE, TILE, '#232323');
    if (ty === 13 && tx % 3 === 0) px(ctx, bx + 13, by + 14, 6, 4, '#F9BD2B');
    if (ty === 5 || ty === 9) { ctx.fillStyle = '#333'; ctx.fillRect(bx, by, TILE, 2); }
    return;
  }

  if (t === T.SIDEWALK) {
    px(ctx, bx, by, TILE, TILE, '#7a7a72');
    ctx.fillStyle = '#6e6e66';
    ctx.fillRect(bx, by, TILE, 1); ctx.fillRect(bx, by, 1, TILE);
    if ((tx * 3 + ty * 7) % 11 === 0) px(ctx, bx + 8, by + 8, 5, 3, '#686860');
    return;
  }

  if (t === T.STOREFRONT) {
    const cols = ['#3a3a4a', '#2a3a2a', '#3a2a2a', '#2a2a3a', '#353030'];
    px(ctx, bx, by, TILE, TILE, cols[tx % 5]);
    const lit = (tx * 13 + ty * 7) % 5 !== 0;
    ctx.fillStyle = lit ? '#d4a820' : '#111827';
    ctx.fillRect(bx + 4, by + 4, 8, 10);  ctx.fillRect(bx + 20, by + 4, 8, 10);
    ctx.fillRect(bx + 4, by + 20, 8, 10); ctx.fillRect(bx + 20, by + 20, 8, 10);
    ctx.fillStyle = '#111';
    ctx.fillRect(bx + 4, by + 4, 1, 10); ctx.fillRect(bx + 12, by + 4, 1, 10);
    ctx.fillRect(bx + 4, by + 4, 8, 1);  ctx.fillRect(bx + 4, by + 14, 8, 1);
    ctx.fillRect(bx + 20, by + 4, 1, 10); ctx.fillRect(bx + 28, by + 4, 1, 10);
    ctx.fillRect(bx + 20, by + 4, 8, 1);  ctx.fillRect(bx + 20, by + 14, 8, 1);
    return;
  }

  if (t === T.LAMP) {
    px(ctx, bx, by, TILE, TILE, '#7a7a72');
    ctx.fillStyle = '#6e6e66'; ctx.fillRect(bx, by, TILE, 1); ctx.fillRect(bx, by, 1, TILE);
    px(ctx, bx + 15, by + 2, 2, 28, '#999');
    px(ctx, bx + 9, by + 2, 14, 3, '#bbb');
    ctx.fillStyle = 'rgba(255,220,80,0.3)';
    ctx.beginPath(); ctx.arc(bx + 16, by + 4, 9, 0, Math.PI * 2); ctx.fill();
    px(ctx, bx + 11, by + 2, 10, 4, '#ffe87a');
    return;
  }

  if (t === T.HYDRANT) {
    px(ctx, bx, by, TILE, TILE, '#7a7a72');
    ctx.fillStyle = '#6e6e66'; ctx.fillRect(bx, by, TILE, 1); ctx.fillRect(bx, by, 1, TILE);
    px(ctx, bx + 12, by + 18, 8, 10, '#c94040');
    px(ctx, bx + 10, by + 16, 12, 4, '#c94040');
    px(ctx, bx + 10, by + 24, 12, 4, '#a83030');
    px(ctx, bx + 13, by + 14, 6, 4, '#c94040');
    px(ctx, bx + 14, by + 11, 4, 4, '#d44040');
    px(ctx, bx + 10, by + 20, 2, 2, '#e05050'); px(ctx, bx + 20, by + 20, 2, 2, '#e05050');
    return;
  }

  if (t === T.MANHOLE) {
    px(ctx, bx, by, TILE, TILE, '#232323');
    ctx.fillStyle = '#404040';
    ctx.beginPath(); ctx.arc(bx + 16, by + 16, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#555';
    ctx.beginPath(); ctx.arc(bx + 16, by + 16, 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#333';
    for (let i = -8; i <= 8; i += 4) {
      ctx.fillRect(bx + 16 + i - 1, by + 8, 2, 16);
      ctx.fillRect(bx + 8, by + 16 + i - 1, 16, 2);
    }
    return;
  }

  if (t === T.BUS_STOP) {
    px(ctx, bx, by, TILE, TILE, '#232323');
    px(ctx, bx + 6, by + 2, 2, 28, '#aaa');
    px(ctx, bx + 2, by + 2, 14, 10, '#c94040');
    px(ctx, bx + 3, by + 3, 12, 8, '#d44040');
    px(ctx, bx + 14, by + 18, 16, 4, '#7a5535');
    px(ctx, bx + 14, by + 24, 16, 4, '#7a5535');
    px(ctx, bx + 14, by + 18, 2, 10, '#5a3a1a');
    px(ctx, bx + 28, by + 18, 2, 10, '#5a3a1a');
    return;
  }

  const bases: Record<number, string> = {
    [T.PATH]: '#c8a96e', [T.WALL]: '#8B7355', [T.ROOF]: '#c94040',
    [T.DOOR]: '#b8996e', [T.SIGN]: '#c8a96e', [T.STAGE]: '#9B8060',
    [T.DUMP]: '#3a5a1a', [T.BILL]: '#1a1a1a',
  };
  px(ctx, bx, by, TILE, TILE, bases[t] || '#3a3a3a');

  if (t === T.PATH) {
    px(ctx, bx + 1, by + 1, TILE - 2, TILE - 2, '#b8996e');
    px(ctx, bx, by, TILE, 1, '#a08858'); px(ctx, bx, by, 1, TILE, '#a08858');
  }
  if (t === T.WALL) {
    const row = Math.floor(by / 8) % 2;
    ctx.fillStyle = '#7a6345';
    for (let i = 0; i < 5; i++) {
      const bx2 = bx + ((i * 8 + (row ? 4 : 0)) % TILE);
      ctx.fillRect(bx2, by, 1, TILE);
    }
    ctx.fillStyle = '#6a5335';
    for (let i = 0; i < 4; i++) ctx.fillRect(bx, by + i * 8, TILE, 1);
  }
  if (t === T.ROOF) {
    px(ctx, bx + 2, by + 2, TILE - 4, TILE - 4, '#a83030');
    ctx.fillStyle = '#c94040';
    for (let i = 0; i < 4; i++) ctx.fillRect(bx, by + i * 8, TILE, 2);
  }
  if (t === T.DOOR) {
    px(ctx, bx + 8, by + 2, 16, 28, '#5a3a1a');
    px(ctx, bx + 9, by + 3, 14, 26, '#8B5a2a');
    px(ctx, bx + 9, by + 3, 6, 12, '#7a4a1a'); px(ctx, bx + 17, by + 3, 6, 12, '#7a4a1a');
    px(ctx, bx + 20, by + 18, 3, 4, '#F9BD2B');
  }
  if (t === T.SIGN) {
    px(ctx, bx + 2, by + 4, TILE - 4, 18, '#8B6914');
    px(ctx, bx + 4, by + 6, TILE - 8, 14, '#F9BD2B');
    px(ctx, bx + 7, by + 9, 18, 2, C.BK); px(ctx, bx + 7, by + 13, 12, 2, C.BK);
    px(ctx, bx + 13, by + 22, 4, 10, '#8B6914');
  }
  if (t === T.STAGE) {
    px(ctx, bx + 1, by + 1, TILE - 2, TILE - 2, '#8B7050');
    px(ctx, bx, by, TILE, 2, '#F9BD2B');
    ctx.fillStyle = '#7a6040';
    for (let i = 0; i < 4; i++) ctx.fillRect(bx, by + i * 8 + 4, TILE, 1);
  }
  if (t === T.BILL) {
    px(ctx, bx, by, TILE, TILE, '#222');
    px(ctx, bx + 2, by + 2, TILE - 4, TILE - 4, '#F9BD2B');
    px(ctx, bx + 5, by + 5, TILE - 10, TILE - 10, '#D4A882');
    px(ctx, bx + 5, by + 5, TILE - 10, 5, '#1a1820');
    px(ctx, bx + 8, by + 14, 3, 2, '#111'); px(ctx, bx + 19, by + 14, 3, 2, '#111');
    px(ctx, bx + 11, by + 19, 10, 2, '#111');
    px(ctx, bx + 11, by + 21, 2, 2, '#111'); px(ctx, bx + 19, by + 21, 2, 2, '#111');
  }
  if (t === T.DUMP) {
    px(ctx, bx + 2, by + 4, TILE - 4, TILE - 6, '#2a4a10');
    px(ctx, bx + 2, by + 4, TILE - 4, 8, '#1a3a08');
    px(ctx, bx + 4, by + 6, 5, 4, '#3a5a18'); px(ctx, bx + 12, by + 6, 5, 4, '#3a5a18'); px(ctx, bx + 20, by + 6, 5, 4, '#3a5a18');
    px(ctx, bx + 11, by + 8, 10, 4, '#F9BD2B'); px(ctx, bx + 12, by + 9, 8, 2, '#fff');
    px(ctx, bx + 4, by + 26, 6, 4, '#111'); px(ctx, bx + 22, by + 26, 6, 4, '#111');
  }
}

export function drawInteriorTile(ctx: CanvasRenderingContext2D, tx: number, ty: number, t: number, floorColor?: string) {
  const bx = tx * TILE, by = ty * TILE;
  const isCarpet = floorColor === '#c94040';
  const floorC = floorColor ?? '#2a2a2a';
  const groutC = floorColor && !isCarpet ? '#c0bdb4' : '#222';
  px(ctx, bx, by, TILE, TILE, floorC);
  if (!isCarpet) {
    ctx.fillStyle = groutC;
    ctx.fillRect(bx, by, TILE, 1); ctx.fillRect(bx, by, 1, TILE);
  }
  if (floorColor && !isCarpet) {
    // Subtle marble veining
    const vc = '#c8c4bc';
    if ((tx + ty * 3) % 7 === 0) px(ctx, bx + 5, by + 9,  16, 1, vc);
    if ((tx * 2 + ty) % 9 === 0) px(ctx, bx + 2, by + 20, 12, 1, vc);
  }
  if (t === TI.FLOOR) return;

  if (t === TI.DESK) {
    px(ctx, bx + 2, by + 4, TILE - 4, TILE - 8, '#7a5535');
    px(ctx, bx + 4, by + 6, TILE - 8, TILE - 12, '#8B6040');
    px(ctx, bx + 8, by + 8, 14, 2, '#555'); px(ctx, bx + 8, by + 8, 2, 6, '#555');
    px(ctx, bx + 8, by + 14, 14, 2, '#555'); px(ctx, bx + 20, by + 8, 2, 8, '#555');
    px(ctx, bx + 10, by + 10, 12, 4, '#3a8acc');
  }
  if (t === TI.POSTIT) {
    px(ctx, bx, by, TILE, TILE, floorC);
    px(ctx, bx + 2, by + 2, 10, 8, '#F9BD2B');
    px(ctx, bx + 14, by + 2, 10, 8, '#ff9966');
    px(ctx, bx + 8, by + 12, 10, 8, '#aaffaa');
    px(ctx, bx + 2, by + 18, 10, 8, '#ff9966');
    px(ctx, bx + 14, by + 16, 10, 8, '#F9BD2B');
    px(ctx, bx + 4, by + 5, 6, 1, '#8B6914'); px(ctx, bx + 4, by + 7, 4, 1, '#8B6914');
    px(ctx, bx + 16, by + 5, 6, 1, '#8B6914'); px(ctx, bx + 10, by + 15, 6, 1, '#8B6914');
  }
  if (t === TI.WORKBENCH) {
    // Workbench surface
    px(ctx, bx+1,  by+8,  30, 7, '#5a3a1a');
    px(ctx, bx+1,  by+8,  30, 2, '#8B6040');
    // Legs
    px(ctx, bx+2,  by+15, 4,  13, '#3a2010');
    px(ctx, bx+26, by+15, 4,  13, '#3a2010');
    px(ctx, bx+2,  by+25, 28,  2, '#3a2010');
    // Circuit board
    px(ctx, bx+4,  by+9,  10,  4, '#1a3a1a');
    px(ctx, bx+6,  by+10,  2,  1, '#00cc44');
    px(ctx, bx+9,  by+10,  2,  1, '#00cc44');
    px(ctx, bx+7,  by+9,   1,  4, '#00cc44');
    // Wires
    px(ctx, bx+16, by+9,  10,  2, '#cc3333');
    px(ctx, bx+16, by+11, 10,  2, '#2244cc');
    // Soldering iron
    px(ctx, bx+24, by+9,   2,  6, '#777');
    px(ctx, bx+24, by+9,   2,  2, '#ffaa00');
  }
  if (t === TI.SHELF) {
    // Podium / lectern
    px(ctx, bx+4,  by+6,  24, 10, '#5a3a1a');
    px(ctx, bx+5,  by+7,  22,  8, '#7a5535');
    px(ctx, bx+5,  by+7,  22,  2, '#8B6040');
    px(ctx, bx+12, by+16,  8, 10, '#5a3a1a');
    px(ctx, bx+6,  by+26, 20,  4, '#5a3a1a');
    px(ctx, bx+7,  by+27, 18,  2, '#7a5535');
    // Microphone stand + head
    px(ctx, bx+15, by+1,   2,  6, '#555');
    px(ctx, bx+12, by+0,   8,  3, '#333');
    px(ctx, bx+13, by+0,   6,  4, '#444');
    px(ctx, bx+14, by+0,   4,  2, '#888');
  }
  if (t === TI.COMPUTER) {
    px(ctx, bx, by, TILE, TILE, floorC);
    px(ctx, bx + 4, by + 4, 24, 20, '#1a1a1a');
    px(ctx, bx + 5, by + 5, 22, 18, '#0a2a0a');
    px(ctx, bx + 7, by + 8, 8, 1, '#00ff44'); px(ctx, bx + 7, by + 11, 14, 1, '#00ff44');
    px(ctx, bx + 7, by + 14, 10, 1, '#00ff44'); px(ctx, bx + 7, by + 17, 6, 1, '#00ff44');
    px(ctx, bx + 14, by + 17, 4, 1, '#00ff44');
    px(ctx, bx + 14, by + 24, 4, 4, '#444');
    px(ctx, bx + 10, by + 28, 12, 2, '#333');
  }
  if (t === TI.BIGBAG) {
    px(ctx, bx, by, TILE, TILE, floorC);
    const isLeft = (tx % 2) === 0;
    const isTop  = (ty % 2) === 0;
    const ox = isLeft ? bx : bx - TILE;
    const oy = isTop  ? by : by - TILE;
    ctx.save();
    ctx.beginPath(); ctx.rect(bx, by, TILE, TILE); ctx.clip();
    // Floor shadow
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath(); ctx.ellipse(ox+33, oy+54, 25, 7, 0, 0, Math.PI*2); ctx.fill();
    // Dark outer rim
    ctx.fillStyle = '#7a1818';
    ctx.beginPath(); ctx.ellipse(ox+32, oy+37, 27, 20, 0, 0, Math.PI*2); ctx.fill();
    // Main body
    ctx.fillStyle = '#c94040';
    ctx.beginPath(); ctx.ellipse(ox+32, oy+35, 25, 18, 0, 0, Math.PI*2); ctx.fill();
    // Upper dome (lighter — the top surface)
    ctx.fillStyle = '#d95050';
    ctx.beginPath(); ctx.ellipse(ox+32, oy+29, 19, 13, 0, 0, Math.PI*2); ctx.fill();
    // Specular highlight
    ctx.fillStyle = '#e86868';
    ctx.beginPath(); ctx.ellipse(ox+28, oy+24, 9, 6, 0, 0, Math.PI*2); ctx.fill();
    // Panel seams — cross pattern wrapping over sphere
    ctx.strokeStyle = '#881818'; ctx.lineWidth = 1.5;
    // Vertical seam
    ctx.beginPath();
    ctx.moveTo(ox+32, oy+17);
    ctx.bezierCurveTo(ox+30, oy+28, ox+30, oy+43, ox+32, oy+54);
    ctx.stroke();
    // Horizontal seam
    ctx.beginPath();
    ctx.moveTo(ox+7, oy+35);
    ctx.bezierCurveTo(ox+16, oy+32, ox+48, oy+32, ox+57, oy+35);
    ctx.stroke();
    // Diagonal seam NW→SE
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ox+14, oy+20); ctx.bezierCurveTo(ox+24, oy+30, ox+40, oy+42, ox+50, oy+52);
    ctx.stroke();
    // Diagonal seam NE→SW
    ctx.beginPath();
    ctx.moveTo(ox+50, oy+20); ctx.bezierCurveTo(ox+40, oy+30, ox+24, oy+42, ox+14, oy+52);
    ctx.stroke();
    ctx.restore();
  }
  if (t === TI.BEANBAG) {
    px(ctx, bx, by, TILE, TILE, floorC);
    px(ctx, bx + 4, by + 8, 24, 18, '#c94040');
    px(ctx, bx + 6, by + 6, 20, 14, '#d95050');
    px(ctx, bx + 10, by + 4, 12, 6, '#d95050');
    px(ctx, bx + 8, by + 22, 16, 4, '#b03030');
  }
  if (t === TI.CHEST) {
    px(ctx, bx, by, TILE, TILE, floorC);
    px(ctx, bx + 4, by + 8, 24, 18, '#8B6914');
    px(ctx, bx + 4, by + 8, 24, 6, '#a07830');
    px(ctx, bx + 13, by + 14, 6, 6, '#F9BD2B');
    px(ctx, bx + 14, by + 15, 4, 4, '#8B6914');
  }
  if (t === TI.BIGTV) {
    px(ctx, bx, by, TILE, TILE, floorC);
    const isLeft = (tx % 2) === 0;
    const isTop  = (ty % 2) === 0;
    const ox = isLeft ? bx : bx - TILE;
    const oy = isTop  ? by : by - TILE;
    ctx.save();
    ctx.beginPath(); ctx.rect(bx, by, TILE, TILE); ctx.clip();
    // Bezel — retro brownish plastic, simulated rounded corners
    px(ctx, ox+2, oy,    60, 58, '#3a342c');
    px(ctx, ox,   oy+2,  64, 54, '#3a342c');
    px(ctx, ox+4, oy+2,  56,  2, '#4a443c'); // top highlight
    px(ctx, ox+3, oy+4,   2, 48, '#4a443c'); // left highlight
    // Screen area
    const sx = ox+5, sy = oy+4, SW = 54, SH = 50;
    px(ctx, sx, sy, SW, SH, '#7a7a7a');
    // Grid background
    ctx.fillStyle = '#8a8a8a';
    for (let i = 0; i < SW; i += 4) ctx.fillRect(sx+i, sy, 1, SH);
    for (let i = 0; i < SH; i += 4) ctx.fillRect(sx, sy+i, SW, 1);
    // Color bars — top 16px
    const cbars = ['#fff','#ff0','#0ff','#0a0','#f0f','#d33','#00f','#000'];
    const bw = Math.floor(SW / cbars.length);
    for (let i = 0; i < cbars.length; i++) px(ctx, sx+i*bw, sy, bw, 16, cbars[i]);
    // Middle section — rows 16-37 (22px), circle + side blocks
    px(ctx, sx,       sy+16, 8, 22, '#ff0');  // yellow left
    px(ctx, sx+8,     sy+16, 8, 22, '#000');  // black
    px(ctx, sx+SW-16, sy+16, 8, 22, '#000');  // black
    px(ctx, sx+SW-8,  sy+16, 8, 22, '#fff');  // white right
    // Circle ring
    const cx = sx + SW/2, cy = sy + 27;
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(cx, cy, 11, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#7a7a7a';
    ctx.beginPath(); ctx.arc(cx, cy,  9, 0, Math.PI*2); ctx.fill();
    // Re-grid inside circle
    ctx.fillStyle = '#8a8a8a';
    for (let i = 0; i < SW; i += 4) ctx.fillRect(sx+i, sy+16, 1, 22);
    for (let i = 0; i < 22; i += 4) ctx.fillRect(sx, sy+16+i, SW, 1);
    // Crosshairs
    px(ctx, cx-1, sy+16, 2, 22, '#fff');
    px(ctx, sx+16, cy-1, SW-32, 2, '#fff');
    px(ctx, cx-2, cy-2, 4, 4, '#000');
    // Bottom — fine alternating bars (rows 38-45) + solid gray blocks
    for (let i = 0; i < SW; i++) { ctx.fillStyle = i%2===0?'#000':'#fff'; ctx.fillRect(sx+i, sy+38, 1, 6); }
    px(ctx, sx,    sy+44, 18, 6, '#111');
    px(ctx, sx+18, sy+44, 18, 6, '#7a7a7a');
    px(ctx, sx+36, sy+44, 18, 6, '#eee');
    // Stand
    px(ctx, ox+24, oy+58, 16, 4, '#2a2520');
    px(ctx, ox+14, oy+62, 36,  2, '#1a1510');
    ctx.restore();
  }
  if (t === TI.TV) {
    px(ctx, bx, by, TILE, TILE, floorC);
    // Wall-mount arm (extends 12px above tile like bust)
    px(ctx, bx + 13, by - 12, 6, 14, '#555');
    px(ctx, bx + 10, by - 3,  10, 3, '#666');
    // Outer bezel — 30px tall (by-11 to by+19)
    px(ctx, bx + 1,  by - 11, TILE - 2, 30, '#1a1a1a');
    px(ctx, bx + 2,  by - 10, TILE - 4, 28, '#111');
    // Screen
    px(ctx, bx + 3,  by - 8,  TILE - 6, 22, '#0a0a2a');
    // Show content lines
    px(ctx, bx + 5,  by - 6,  7,  1, '#aaaaff');
    px(ctx, bx + 5,  by - 3,  12, 1, '#aaaaff');
    px(ctx, bx + 5,  by,      9,  1, '#aaaaff');
    px(ctx, bx + 5,  by + 3,  14, 1, '#aaaaff');
    px(ctx, bx + 5,  by + 6,  6,  1, '#aaaaff');
    px(ctx, bx + 5,  by + 9,  11, 1, '#aaaaff');
    // Brand strip
    px(ctx, bx + 3,  by + 14, TILE - 6, 4, '#F9BD2B');
    px(ctx, bx + 5,  by + 15, TILE - 10, 2, '#1a1a1a');
    // Stand + base
    px(ctx, bx + 13, by + 19, 6, 4, '#333');
    px(ctx, bx + 10, by + 22, 12, 2, '#444');
    px(ctx, bx + 7,  by + 24, 18, 5, '#2a2a2a');
    px(ctx, bx + 5,  by + 28, 22, 3, '#333');
  }
  if (t === TI.MERCH) {
    px(ctx, bx, by, TILE, TILE, floorC);
    px(ctx, bx + 1, by + 4, TILE - 2, 4, '#8B6914');
    px(ctx, bx + 1, by + 14, TILE - 2, 4, '#8B6914');
    px(ctx, bx + 1, by + 24, TILE - 2, 4, '#8B6914');
    px(ctx, bx + 4, by + 8, 8, 6, '#F9BD2B');
    px(ctx, bx + 14, by + 8, 8, 6, '#c94040');
    px(ctx, bx + 4, by + 18, 4, 4, '#F9BD2B'); px(ctx, bx + 10, by + 18, 4, 4, '#c94040');
    px(ctx, bx + 16, by + 18, 4, 4, '#3498DB'); px(ctx, bx + 22, by + 18, 4, 4, '#2ECC71');
  }
  if (t === TI.GLASS) {
    px(ctx, bx, by, TILE, TILE, floorC);
    px(ctx, bx + 2, by + 2, TILE - 4, TILE - 4, '#223344');
    px(ctx, bx + 3, by + 3, TILE - 6, TILE - 6, 'rgba(100,180,255,0.15)');
    px(ctx, bx + 2, by + 2, TILE - 4, 2, '#F9BD2B'); px(ctx, bx + 2, by + TILE - 6, TILE - 4, 2, '#F9BD2B');
    px(ctx, bx + 2, by + 2, 2, TILE - 4, '#F9BD2B'); px(ctx, bx + TILE - 6, by + 2, 2, TILE - 4, '#F9BD2B');
    px(ctx, bx + 12, by + 8, 8, 14, '#D4A882');
    px(ctx, bx + 12, by + 6, 8, 4, '#b03a2e');
    px(ctx, bx + 13, by + 8, 6, 8, '#e8603a');
  }
  if (t === TI.PLANT) {
    px(ctx, bx + 8, by + 19, 16, 3, '#5a2a0a');
    px(ctx, bx + 9, by + 20, 14, 8, '#b5631a');
    px(ctx, bx + 8, by + 22, 16, 6, '#9a4a10');
    px(ctx, bx + 7, by + 28, 18, 2, '#7a3a0a');
    px(ctx, bx + 15, by + 12, 2, 9, '#2d5a1b');
    px(ctx, bx + 11, by + 15, 2, 7, '#2d5a1b');
    px(ctx, bx + 19, by + 14, 2, 8, '#2d5a1b');
    px(ctx, bx + 8,  by + 6,  10, 8, '#3a8a2a');
    px(ctx, bx + 16, by + 8,  8, 7, '#2d7a1e');
    px(ctx, bx + 12, by + 4,  8, 7, '#45a030');
    px(ctx, bx + 6,  by + 12, 7, 5, '#3a8a2a');
    px(ctx, bx + 19, by + 11, 7, 5, '#4a9a3a');
  }
  if (t === TI.SOFA) {
    px(ctx, bx + 2, by + 6,  TILE - 4, 10, '#5a3a8a');
    px(ctx, bx + 3, by + 7,  TILE - 6, 8, '#6a4a9a');
    px(ctx, bx + 4, by + 16, TILE - 8, 10, '#6a4a9a');
    px(ctx, bx + 2, by + 6,  4, 18, '#4a2a7a');
    px(ctx, bx + TILE - 6, by + 6, 4, 18, '#4a2a7a');
    px(ctx, bx + 14, by + 16, 2, 8, '#4a2a7a');
    px(ctx, bx + 5,  by + 26, 3, 3, '#333');
    px(ctx, bx + TILE - 8, by + 26, 3, 3, '#333');
  }
  if (t === TI.STATUE) {
    px(ctx, bx + 7, by + 22, 18, 8, '#888');
    px(ctx, bx + 8, by + 23, 16, 6, '#aaa');
    px(ctx, bx + 5, by + 28, 22, 4, '#999');
    px(ctx, bx + 9, by + 12, 14, 10, '#d4a820');
    px(ctx, bx + 10, by + 10, 12, 12, '#F9BD2B');
    px(ctx, bx + 10, by + 9,  2, 6, '#8B6914');
    px(ctx, bx + 14, by + 8,  2, 8, '#8B6914');
    px(ctx, bx + 18, by + 9,  2, 6, '#8B6914');
    px(ctx, bx + 20, by + 14, 4, 4, '#e8c070');
    px(ctx, bx + 22, by + 15, 3, 2, '#222');
  }
  if (t === TI.ART) {
    px(ctx, bx + 3, by + 5,  TILE - 6, TILE - 8, '#8B6914');
    px(ctx, bx + 5, by + 7,  TILE - 10, TILE - 12, '#e8d8b0');
    px(ctx, bx + 7, by + 9,  7, 5, '#c94040');
    px(ctx, bx + 16, by + 8, 5, 7, '#3498DB');
    px(ctx, bx + 9, by + 15, 8, 4, '#2ECC71');
    px(ctx, bx + 14, by + 13, 5, 5, '#F9BD2B');
    px(ctx, bx + 13, by + 3,  2, 3, '#777');
    px(ctx, bx + 9,  by + 3,  4, 1, '#555');
    px(ctx, bx + 17, by + 3,  4, 1, '#555');
  }
  if (t === TI.OPENBOOK) {
    // Cover
    px(ctx, bx + 3, by + 4, 26, 24, '#8B6914');
    // Left page
    px(ctx, bx + 4,  by + 5, 11, 22, '#f5f0e0');
    // Right page
    px(ctx, bx + 17, by + 5, 11, 22, '#f5f0e0');
    // Spine
    px(ctx, bx + 15, by + 4, 2, 24, '#5a3a08');
    // Text lines — left page
    px(ctx, bx + 6,  by + 8,  7, 1, '#bbb');
    px(ctx, bx + 6,  by + 11, 7, 1, '#ccc');
    px(ctx, bx + 6,  by + 14, 7, 1, '#ccc');
    px(ctx, bx + 6,  by + 17, 5, 1, '#ccc');
    px(ctx, bx + 6,  by + 20, 7, 1, '#ccc');
    px(ctx, bx + 6,  by + 23, 4, 1, '#ccc');
    // Text lines — right page
    px(ctx, bx + 19, by + 8,  7, 1, '#bbb');
    px(ctx, bx + 19, by + 11, 7, 1, '#ccc');
    px(ctx, bx + 19, by + 14, 7, 1, '#ccc');
    px(ctx, bx + 19, by + 17, 5, 1, '#ccc');
    px(ctx, bx + 19, by + 20, 7, 1, '#ccc');
    px(ctx, bx + 19, by + 23, 4, 1, '#ccc');
    // Golden glow (it's a special book)
    ctx.fillStyle = 'rgba(249,189,43,0.12)';
    ctx.fillRect(bx + 3, by + 4, 26, 24);
  }
  if (t === TI.PENCIL) {
    // Eraser (left end)
    px(ctx, bx + 2,  by + 13, 3, 6, '#e8a0a0');
    px(ctx, bx + 5,  by + 12, 2, 8, '#bbb');
    // Body (yellow)
    px(ctx, bx + 7,  by + 11, 16, 10, '#F9BD2B');
    px(ctx, bx + 7,  by + 12, 16,  2, '#FFD060');
    px(ctx, bx + 7,  by + 20, 16,  1, '#d4a000');
    // Wood tip
    px(ctx, bx + 23, by + 12,  5,  8, '#e8c878');
    px(ctx, bx + 26, by + 13,  4,  6, '#f0d890');
    // Graphite point
    px(ctx, bx + 29, by + 14,  2,  4, '#444');
    px(ctx, bx + 30, by + 15,  1,  2, '#222');
  }
  if (t === TI.BOOK) {
    // Dark mahogany table surface
    px(ctx, bx, by, TILE, TILE, '#1a0d04');
    px(ctx, bx + 1, by + 1, TILE - 2, TILE - 2, '#221208');
    ctx.fillStyle = '#1c0e06';
    ctx.fillRect(bx + 2, by + 10, TILE - 4, 1);
    ctx.fillRect(bx + 2, by + 22, TILE - 4, 1);
    // Golden glow radiating from center of the 2×2 table
    const isLeft = (tx % 2) === 0;
    const isTop  = (ty % 2) === 1;
    const gx = isLeft ? bx + TILE : bx;
    const gy = isTop  ? by + TILE : by;
    const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, 34);
    grd.addColorStop(0, 'rgba(255,220,60,0.65)');
    grd.addColorStop(0.5, 'rgba(249,189,43,0.25)');
    grd.addColorStop(1, 'rgba(249,189,43,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(bx, by, TILE, TILE);
    // Open book — each tile shows one quadrant of a 40×28 book centered on the 2×2 group
    const pageW = 20, pageH = 14;
    const px1 = isLeft ? bx + TILE - pageW : bx;
    const py1 = isTop  ? by + TILE - pageH : by;
    px(ctx, px1, py1, pageW, pageH, '#F9BD2B');
    px(ctx, px1, py1, pageW, 2, '#FFE870');
    px(ctx, px1 + 2, py1 + 4, pageW - 4, 1, '#7a5010');
    px(ctx, px1 + 2, py1 + 7, pageW - 4, 1, '#7a5010');
    px(ctx, px1 + 2, py1 + 10, pageW - 4, 1, '#7a5010');
    // Spine at the shared seam between left/right tiles
    if (isLeft) px(ctx, bx + TILE - 3, py1, 3, pageH, '#5a3a08');
    else         px(ctx, bx,             py1, 3, pageH, '#5a3a08');
    // Binding crease at the shared seam between top/bottom tiles
    if (isTop) px(ctx, px1, by + TILE - 2, pageW, 2, '#5a3a08');
    else        px(ctx, px1, by,             pageW, 2, '#5a3a08');
  }
  if (t === TI.SERVER) {
    px(ctx, bx, by, TILE, TILE, '#0d0d10');
    px(ctx, bx+1, by+1, TILE-2, TILE-2, '#13131a');
    // rack screws
    px(ctx, bx+1, by+1, 2, 2, '#2a2a35'); px(ctx, bx+29, by+1, 2, 2, '#2a2a35');
    px(ctx, bx+1, by+29, 2, 2, '#2a2a35'); px(ctx, bx+29, by+29, 2, 2, '#2a2a35');
    // drive bays (vary pattern by tx so adjacent racks look different)
    const bays = [4, 10, 16, 22];
    const ledCols = ['#00cc44', '#0066ff', '#F9BD2B', '#cc2200'];
    for (let i = 0; i < bays.length; i++) {
      const row = bays[i];
      px(ctx, bx+3,  by+row,   20, 5, '#09090f');
      px(ctx, bx+4,  by+row+1, 18, 3, '#111118');
      const active = (tx + ty + i) % 3 !== 2;
      px(ctx, bx+5,  by+row+2, 2,  1, active ? '#00ee55' : '#004422');
      px(ctx, bx+9,  by+row+2, (tx*3+i*5)%8+4, 1, '#1a2a1a');
    }
    // status LEDs on right strip
    for (let i = 0; i < 4; i++) {
      const lit = (tx + ty + i) % 4 !== 3;
      px(ctx, bx+26, by+bays[i], 3, 3, lit ? ledCols[i] : '#111');
    }
    // top cable management bar
    px(ctx, bx+2, by+2, TILE-4, 1, '#1e1e28');
    // vents at bottom
    px(ctx, bx+3, by+28, 26, 1, '#09090f');
    px(ctx, bx+3, by+30, 26, 1, '#09090f');
  }
  if (t === TI.PAINTING) {
    px(ctx, bx, by, TILE, TILE, '#f0ede0');
  }
  if (t === TI.BUST) {
    // Extends 12px above the tile so the bust is ~44px tall (bigger than 32px character)
    // Head
    px(ctx, bx + 9,  by - 12, 14, 16, '#c8c8c8');
    px(ctx, bx + 10, by - 13, 12, 2,  '#c8c8c8');
    // Hair (short, receding)
    px(ctx, bx + 10, by - 13, 12, 3,  '#8a8a8a');
    px(ctx, bx + 9,  by - 11, 2,  5,  '#8a8a8a');
    px(ctx, bx + 21, by - 11, 2,  5,  '#8a8a8a');
    // Cheeks / jaw shaping
    px(ctx, bx + 8,  by - 8,  2,  6,  '#bbb');
    px(ctx, bx + 22, by - 8,  2,  6,  '#bbb');
    // Round glasses (iconic — two square lenses)
    px(ctx, bx + 9,  by - 6,  6,  5,  '#444');
    px(ctx, bx + 17, by - 6,  6,  5,  '#444');
    px(ctx, bx + 10, by - 5,  4,  3,  '#c0c0c0');
    px(ctx, bx + 18, by - 5,  4,  3,  '#c0c0c0');
    px(ctx, bx + 15, by - 5,  2,  1,  '#444');
    // Nose
    px(ctx, bx + 14, by - 1,  4,  4,  '#b0b0b0');
    // Neck
    px(ctx, bx + 12, by + 3,  8,  5,  '#b8b8b8');
    // Shoulders (wider stone base)
    px(ctx, bx + 5,  by + 7,  22, 12, '#8a8a8a');
    px(ctx, bx + 7,  by + 6,  18, 3,  '#9e9e9e'); // shoulder highlight
    // Plaque
    px(ctx, bx + 7,  by + 17, 18, 5,  '#8B6914');
    px(ctx, bx + 8,  by + 18, 16, 3,  '#a07820'); // plaque face
    // Plinth
    px(ctx, bx + 8,  by + 22, 16, 6,  '#6a6a6a');
    px(ctx, bx + 6,  by + 26, 20, 4,  '#555');
    px(ctx, bx + 4,  by + 29, 24, 3,  '#444');
    ctx.save();
    ctx.font = '4px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F9BD2B';
    ctx.fillText('SJ', bx + 16, by + 22);
    ctx.restore();
  }
  if (t === TI.COUCH) {
    // Green sectional couch, top-down view
    px(ctx, bx, by, TILE, TILE, '#0e2010');
    // Back cushion (top strip — player faces from below)
    px(ctx, bx + 1, by + 1, TILE - 2, 10, '#1a4820');
    px(ctx, bx + 2, by + 2, TILE - 4,  8, '#1f5526');
    // Seat cushion
    px(ctx, bx + 1, by + 11, TILE - 2, TILE - 13, '#2d7a32');
    px(ctx, bx + 2, by + 12, TILE - 4, TILE - 16, '#38963c');
    // Seat highlight
    px(ctx, bx + 3, by + 13, TILE - 8, 2, '#48b04c');
    // Cushion seam
    px(ctx, bx + TILE / 2, by + 11, 1, TILE - 14, '#1f5526');
  }
}

export function drawBillboard(ctx: CanvasRenderingContext2D) {
  const bx = 504, by = 0;
  const W = 136, H = 64;

  ctx.fillStyle = '#f0f0ec'; ctx.fillRect(bx, by, W, H);
  ctx.fillStyle = '#e06030'; ctx.fillRect(bx + 2, by + 2, W - 4, H - 10);
  ctx.fillStyle = '#c84820'; ctx.fillRect(bx + 2, by + 2, W - 4, 3);

  const bhx = bx + 8, bhy = by + 6;
  const s = 2;
  ctx.fillStyle = '#3a2a10';
  ctx.fillRect(bhx + 3*s, bhy,       8*s, 3*s);
  ctx.fillRect(bhx + 2*s, bhy + 2*s, 10*s, 4*s);
  ctx.fillRect(bhx +   s, bhy + 4*s, 10*s, 3*s);
  ctx.fillStyle = '#D4B896';
  ctx.fillRect(bhx + 2*s, bhy + 6*s, 8*s, 8*s);
  ctx.fillRect(bhx +   s, bhy + 7*s, 10*s, 6*s);
  ctx.fillStyle = '#c4906a'; ctx.fillRect(bhx + 3*s, bhy + 9*s, 4*s, 3*s);
  ctx.fillStyle = '#111';
  ctx.fillRect(bhx + 2*s, bhy + 7*s, 2*s, 2*s);
  ctx.fillRect(bhx + 8*s, bhy + 7*s, 2*s, 2*s);
  ctx.fillStyle = '#fff';
  ctx.fillRect(bhx + 2*s, bhy + 7*s, s, s); ctx.fillRect(bhx + 8*s, bhy + 7*s, s, s);
  ctx.fillStyle = '#111'; ctx.fillRect(bhx + 5*s, bhy + 11*s, 2*s, s);
  ctx.fillStyle = '#D4B896';
  ctx.fillRect(bhx + 10*s, bhy + 8*s, 6*s, 2*s);
  ctx.fillRect(bhx + 10*s, bhy + 6*s, 2*s, 4*s);
  ctx.fillStyle = '#D4B896';
  ctx.fillRect(bhx + 2*s, bhy + 14*s, 3*s, 4*s); ctx.fillRect(bhx + 7*s, bhy + 14*s, 3*s, 4*s);

  const mbx = bx + 42, mby = by + 20;
  ctx.fillStyle = '#d8eef8'; ctx.fillRect(mbx, mby, 10, 18);
  ctx.fillStyle = '#c0d8ea'; ctx.fillRect(mbx + 2, mby, 6, 18);
  ctx.fillStyle = '#d8eef8'; ctx.fillRect(mbx + 2, mby - 5, 6, 7);
  ctx.fillStyle = '#3498DB'; ctx.fillRect(mbx + 2, mby - 6, 6, 3);
  ctx.fillStyle = '#fff'; ctx.fillRect(mbx + 1, mby + 4, 8, 8);
  ctx.fillStyle = '#3498DB';
  ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'left';
  ctx.fillText('M', mbx + 3, mby + 10);

  const shx = bx + 62, shy = by + 14;
  const ss = 1;
  ctx.fillStyle = '#3a2a10';
  ctx.fillRect(shx + 3*ss, shy,        8*ss, 3*ss);
  ctx.fillRect(shx + 2*ss, shy + 2*ss, 10*ss, 4*ss);
  ctx.fillRect(shx +   ss, shy + 4*ss, 10*ss, 3*ss);
  ctx.fillStyle = '#D4B896';
  ctx.fillRect(shx + 2*ss, shy + 6*ss, 8*ss, 8*ss);
  ctx.fillRect(shx +   ss, shy + 7*ss, 10*ss, 6*ss);
  ctx.fillStyle = '#c4906a'; ctx.fillRect(shx + 3*ss, shy + 9*ss, 4*ss, 3*ss);
  ctx.fillStyle = '#a06040'; ctx.fillRect(shx + 4*ss, shy + 10*ss, 2*ss, 2*ss);
  ctx.fillStyle = '#111';
  ctx.fillRect(shx + 2*ss, shy + 7*ss, 2*ss, 2*ss);
  ctx.fillRect(shx + 8*ss, shy + 7*ss, 2*ss, 2*ss);
  ctx.fillStyle = '#fff';
  ctx.fillRect(shx + 2*ss, shy + 7*ss, ss, ss); ctx.fillRect(shx + 8*ss, shy + 7*ss, ss, ss);
  ctx.fillStyle = '#D4B896'; ctx.fillRect(shx - 4*ss, shy + 8*ss, 5*ss, 2*ss);
  ctx.fillStyle = '#D4B896';
  ctx.fillRect(shx + 2*ss, shy + 14*ss, 3*ss, 4*ss); ctx.fillRect(shx + 7*ss, shy + 14*ss, 3*ss, 4*ss);

  ctx.save();
  ctx.font = 'bold 5px "Press Start 2P"'; ctx.textAlign = 'left';
  ctx.fillStyle = '#fff'; ctx.fillText('POSTHOG', bx + 4, by + 8);
  ctx.font = 'bold 4px "Press Start 2P"';
  ctx.fillText('DEV', bx + 46, by + 32); ctx.fillText('TOOLS', bx + 44, by + 38);
  ctx.fillText('PRODUCT', bx + 76, by + 14); ctx.fillText('ENGINEERS', bx + 72, by + 20);
  ctx.font = '4px "Press Start 2P"'; ctx.fillStyle = '#1a1a1a';
  ctx.fillText('PostHog', bx + W - 38, by + 8);
  ctx.restore();

  ctx.fillStyle = '#666';
  ctx.fillRect(bx + W / 2 - 10, by + H - 8, 6, 10);
  ctx.fillRect(bx + W / 2 + 4,  by + H - 8, 6, 10);
}

const LOBBY_LABELS: { tx: number; ty: number; dx?: number; text: string; color: string }[] = [
  { tx: 5,  ty: 1,              text: 'ENGINEERING',      color: '#4a9de0' },
  { tx: 14, ty: 1,              text: 'GTM',              color: '#2ECC71' },
  { tx: 2,  ty: 7,  dx: -10,   text: 'COMPANY',          color: '#F9BD2B' },
  { tx: 17, ty: 4,              text: 'TOP SECRET',       color: '#c94040' },
  { tx: 5,  ty: 13,             text: 'THE STREET',       color: '#F9BD2B' },
  { tx: 16, ty: 10,             text: 'APPLICATION CORNER', color: '#F9BD2B' },
];

export function drawHogpatchLabels(ctx: CanvasRenderingContext2D) {
  ctx.font = '6px "Press Start 2P"';
  ctx.textAlign = 'center';
  const cx = 10 * TILE; // center between door tiles at cols 9 and 10
  const cy = TILE + 12; // just below the doors, at top of row 1
  const text = 'POSTHOG HQ';
  const tw = ctx.measureText(text).width;
  px(ctx, Math.round(cx - tw / 2 - 4), cy - 10, Math.round(tw + 8), 12, 'rgba(14,14,14,0.85)');
  ctx.fillStyle = '#F9BD2B';
  ctx.fillText(text, cx, cy);
  ctx.textAlign = 'left';
}

export function drawLobbyLabels(ctx: CanvasRenderingContext2D) {
  ctx.font = '6px "Press Start 2P"';
  ctx.textAlign = 'center';
  for (const { tx, ty, text, color, dx } of LOBBY_LABELS) {
    const cx = tx * TILE + TILE / 2 + (dx ?? 0);
    const cy = ty * TILE + TILE / 2;
    const tw = ctx.measureText(text).width;
    px(ctx, Math.round(cx - tw / 2 - 4), Math.round(cy - 6), Math.round(tw + 8), 12, 'rgba(14,14,14,0.85)');
    ctx.fillStyle = color;
    ctx.fillText(text, cx, cy);
  }
  ctx.textAlign = 'left';
}

function drawTopSecretPainting(ctx: CanvasRenderingContext2D) {
  // Painting spans rows 1-2, cols 7-12 (6×2 tiles = 192×64px)
  const ox = 7 * TILE, oy = 1 * TILE;
  const W = 6 * TILE, H = 2 * TILE;
  const cx = ox + W / 2;

  // Drop shadow
  px(ctx, ox - 8, oy - 8, W + 16, H + 16, '#080503');
  // Outer dark wood frame
  px(ctx, ox - 7, oy - 7, W + 14, H + 14, '#1e0e04');
  px(ctx, ox - 6, oy - 6, W + 12, H + 12, '#2e1608');
  px(ctx, ox - 5, oy - 5, W + 10, H + 10, '#3e200a');
  // Gold molding (3 layers — dark to bright)
  px(ctx, ox - 4, oy - 4, W + 8,  H + 8,  '#5a3c08');
  px(ctx, ox - 3, oy - 3, W + 6,  H + 6,  '#8B6914');
  px(ctx, ox - 2, oy - 2, W + 4,  H + 4,  '#c49a14');
  // Bright inner gold edge
  px(ctx, ox - 1, oy - 1, W + 2,  H + 2,  '#F9BD2B');
  // Cream mat (between frame and canvas)
  px(ctx, ox, oy, W, H, '#ede8dc');
  // Inner shadow line (mat → canvas)
  px(ctx, ox + 4, oy + 4, W - 8,  H - 8,  '#1a1008');
  // Canvas
  px(ctx, ox + 5, oy + 5, W - 10, H - 10, '#f5f0e8');

  // Pixel art foot — top-down view, heel at top, toes pointing down
  // All coords relative to canvas top-left (ox+5, oy+5), canvas = 182×54px
  const fc = oy + 5;
  const sk  = '#D4A882';
  const skd = '#b87850';
  const nl  = '#f8ece6';

  // Heel
  px(ctx, cx - 13, fc + 2,  26, 2,  sk);
  px(ctx, cx - 15, fc + 4,  30, 11, sk);
  px(ctx, cx - 13, fc + 14, 26, 2,  skd);
  // Arch
  px(ctx, cx - 11, fc + 16, 22, 7,  sk);
  // Ball of foot
  px(ctx, cx - 17, fc + 22, 34, 9,  sk);
  // Toes
  const toes = [
    { dx: -17, w: 9,  h: 12 },
    { dx:  -7, w: 7,  h: 10 },
    { dx:   1, w: 6,  h:  9 },
    { dx:   8, w: 5,  h:  8 },
    { dx:  14, w: 4,  h:  7 },
  ];
  for (const t of toes) {
    px(ctx, cx + t.dx, fc + 30, t.w, t.h, sk);
    px(ctx, cx + t.dx + 1, fc + 29, t.w - 2, 3, nl);
    px(ctx, cx + t.dx, fc + 30 + t.h - 2, t.w, 2, skd);
  }

  // Caption
  ctx.save();
  ctx.font = '7px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.fillStyle = '#4a3020';
  ctx.fillText('OnlyToes', cx, oy + H - 8);
  ctx.restore();
}

function drawStanchion(ctx: CanvasRenderingContext2D, x: number, y: number) {
  px(ctx, x - 1, y,      3, 14, '#8B6914');
  px(ctx, x - 3, y - 3,  7,  3, '#F9BD2B');
  px(ctx, x - 3, y + 14, 7,  3, '#8B6914');
  px(ctx, x - 4, y + 17, 9,  2, '#6a4a08');
}

function drawMuseumDetails(ctx: CanvasRenderingContext2D) {
  // Spotlight cone above painting — wide warm beam from ceiling
  ctx.save();
  const paintCx = 10 * TILE; // center of cols 7-12
  const coneGrad = ctx.createLinearGradient(paintCx, 0, paintCx, 3 * TILE);
  coneGrad.addColorStop(0,   'rgba(255,240,160,0.0)');
  coneGrad.addColorStop(0.5, 'rgba(255,240,160,0.13)');
  coneGrad.addColorStop(1,   'rgba(255,240,160,0.0)');
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(paintCx - 4, 0);
  ctx.lineTo(paintCx + 4, 0);
  ctx.lineTo(paintCx + 56, 3 * TILE);
  ctx.lineTo(paintCx - 56, 3 * TILE);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Spotlight glow on bust
  ctx.save();
  const bustCx = 3 * TILE + 16, bustCy = 6 * TILE;
  const bustGrad = ctx.createRadialGradient(bustCx, bustCy, 4, bustCx, bustCy, 56);
  bustGrad.addColorStop(0, 'rgba(255,240,160,0.20)');
  bustGrad.addColorStop(1, 'rgba(255,240,160,0)');
  ctx.fillStyle = bustGrad;
  ctx.fillRect(bustCx - 56, bustCy - 56, 112, 112);
  ctx.restore();

  // Spotlight glow on TV (symmetric to bust)
  ctx.save();
  const tvCx = 16 * TILE + 16, tvCy = 6 * TILE;
  const tvGrad = ctx.createRadialGradient(tvCx, tvCy, 4, tvCx, tvCy, 56);
  tvGrad.addColorStop(0, 'rgba(255,240,160,0.20)');
  tvGrad.addColorStop(1, 'rgba(255,240,160,0)');
  ctx.fillStyle = tvGrad;
  ctx.fillRect(tvCx - 56, tvCy - 56, 112, 112);
  ctx.restore();

  // Rope barrier in front of bust
  const postY = 8 * TILE + 10;
  drawStanchion(ctx, 1 * TILE + 16, postY);
  drawStanchion(ctx, 5 * TILE + 16, postY);
  ctx.save();
  ctx.strokeStyle = '#c49a14';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(1 * TILE + 16, postY + 10);
  ctx.bezierCurveTo(
    2 * TILE + 16, postY + 16,
    4 * TILE,      postY + 16,
    5 * TILE + 16, postY + 10
  );
  ctx.stroke();
  ctx.restore();

  // Rope barrier in front of TV (symmetric)
  drawStanchion(ctx, 14 * TILE + 16, postY);
  drawStanchion(ctx, 18 * TILE + 16, postY);
  ctx.save();
  ctx.strokeStyle = '#c49a14';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(14 * TILE + 16, postY + 10);
  ctx.bezierCurveTo(
    15 * TILE + 16, postY + 16,
    17 * TILE + 16, postY + 16,
    18 * TILE + 16, postY + 10
  );
  ctx.stroke();
  ctx.restore();
}

export function drawMap(ctx: CanvasRenderingContext2D, area: Area, map: MapGrid) {
  for (let ty = 0; ty < ROWS; ty++) {
    for (let tx = 0; tx < COLS; tx++) {
      const t = map[ty][tx];
      if (area === 'hogpatch') {
        drawTile(ctx, tx, ty, t);
      } else if (t === T.WALL || t === T.ROOF || t === T.DOOR) {
        drawTile(ctx, tx, ty, t);
      } else {
        let floorC: string | undefined;
        if (area === 'trash') {
          const onCarpet = tx >= 9 && tx <= 10 && ty >= 3 && ty <= 12;
          floorC = onCarpet ? '#c94040' : '#d8d4cc';
        }
        drawInteriorTile(ctx, tx, ty, t, floorC);
      }
    }
  }
  if (area === 'trash') {
    // Gold carpet trim on both edges (cols 9 and 10)
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(9 * TILE,      3 * TILE, 3, 10 * TILE);
    ctx.fillRect(11 * TILE - 3, 3 * TILE, 3, 10 * TILE);
    drawTopSecretPainting(ctx);
    drawMuseumDetails(ctx);
    return;
  }
  if (area === 'hogpatch') drawHogpatchLabels(ctx);
  if (area === 'lobby') drawLobbyLabels(ctx);
}
