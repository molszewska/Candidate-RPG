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

export function drawInteriorTile(ctx: CanvasRenderingContext2D, tx: number, ty: number, t: number) {
  const bx = tx * TILE, by = ty * TILE;
  const floorC = '#2a2a2a', groutC = '#222';
  px(ctx, bx, by, TILE, TILE, floorC);
  ctx.fillStyle = groutC;
  ctx.fillRect(bx, by, TILE, 1); ctx.fillRect(bx, by, 1, TILE);
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
  if (t === TI.TV) {
    px(ctx, bx, by, TILE, TILE, floorC);
    px(ctx, bx + 2, by + 2, TILE - 4, TILE - 8, '#1a1a1a');
    px(ctx, bx + 3, by + 3, TILE - 6, TILE - 10, '#111');
    px(ctx, bx + 4, by + 4, TILE - 8, TILE - 12, '#0a0a2a');
    px(ctx, bx + 5, by + 6, 6, 1, '#aaaaff'); px(ctx, bx + 5, by + 9, 10, 1, '#aaaaff');
    px(ctx, bx + 5, by + 12, 8, 1, '#aaaaff'); px(ctx, bx + 5, by + 15, 12, 1, '#aaaaff');
    px(ctx, bx + 4, by + TILE - 10, TILE - 8, 6, '#F9BD2B');
    px(ctx, bx + 6, by + TILE - 8, TILE - 12, 2, '#1a1a1a');
    px(ctx, bx + 13, by + TILE - 6, 6, 4, '#333');
    px(ctx, bx + 10, by + TILE - 4, 12, 2, '#444');
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

const LOBBY_LABELS = [
  { tx: 4,  ty: 3,  text: 'ENGINEERING', color: '#4a9de0' },
  { tx: 14, ty: 3,  text: 'GTM',         color: '#2ECC71' },
  { tx: 4,  ty: 8,  text: 'COMPANY',     color: '#F9BD2B' },
  { tx: 14, ty: 8,  text: 'TOP SECRET',  color: '#c94040' },
  { tx: 6,  ty: 12, text: 'THE STREET',  color: '#F9BD2B' },
] as const;

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
  for (const { tx, ty, text, color } of LOBBY_LABELS) {
    const cx = tx * TILE + TILE / 2;
    const cy = ty * TILE - 4;
    const tw = ctx.measureText(text).width;
    px(ctx, Math.round(cx - tw / 2 - 4), cy - 10, Math.round(tw + 8), 12, 'rgba(14,14,14,0.85)');
    ctx.fillStyle = color;
    ctx.fillText(text, cx, cy);
  }
  ctx.textAlign = 'left';
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
        drawInteriorTile(ctx, tx, ty, t);
      }
    }
  }
  if (area === 'trash') return;
  if (area === 'hogpatch') drawHogpatchLabels(ctx);
}
