import { busHog } from './busHog';

export type BusState = { x: number; speed: number; which: number };

export function createBus(): BusState {
  return { x: 680, speed: 1.2, which: 0 };
}

export function updateBus(bus: BusState) {
  bus.x -= bus.speed;
  if (bus.x < -200) {
    bus.x = 680;
    bus.which = 1 - bus.which;
  }
}

export function drawBus(ctx: CanvasRenderingContext2D, bus: BusState, bx: number, by: number) {
  if (bus.which === 0) drawBusRed(ctx, bx, by);
  else                  drawBusBlue(ctx, bx, by);
}

function drawBusBlue(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  const W = 180, H = 52, x = bx, y = by - 10;
  ctx.fillStyle = '#4a9de0'; ctx.fillRect(x, y+8, W, H-8);
  ctx.fillStyle = '#5aaef0'; ctx.fillRect(x+4, y+4, W-8, 8);
  ctx.fillStyle = '#6ac0ff'; ctx.fillRect(x, y+8, W, 2);
  ctx.fillStyle = '#2a6ea0'; ctx.fillRect(x, y+H-4, W, 4);
  const wy = y + H - 2;
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(x+14, wy-12, 28, 14); ctx.fillRect(x+W-42, wy-12, 28, 14);
  ctx.beginPath(); ctx.arc(x+28,    wy, 12, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+W-28,  wy, 12, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ccc';
  ctx.beginPath(); ctx.arc(x+28,   wy, 6, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+W-28, wy, 6, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#888';
  ctx.beginPath(); ctx.arc(x+28,   wy, 3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+W-28, wy, 3, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#2a4a6a'; ctx.fillRect(x+4, y+8, W-8, 18);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = '#3a5a7a'; ctx.fillRect(x+10+i*32, y+10, 26, 14);
    ctx.fillStyle = '#4a6a8a'; ctx.fillRect(x+11+i*32, y+11, 24, 12);
  }
  const lx = x+W-58, ly = y+18;
  ctx.fillStyle = '#f0d020';
  ctx.beginPath(); ctx.ellipse(lx+16, ly+14, 18, 12, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#e8c010';
  ctx.beginPath(); ctx.ellipse(lx+14, ly+13, 16, 10, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#f8e84a'; ctx.fillRect(lx+8, ly+8, 6, 4);
  ctx.fillStyle = '#d4b010'; ctx.fillRect(lx, ly+12, 4, 4); ctx.fillRect(lx+28, ly+12, 4, 4);
  const hx = lx+8, hy = ly+2;
  ctx.fillStyle = '#c94040'; ctx.fillRect(hx+1, hy, 10, 3); ctx.fillRect(hx+3, hy-4, 6, 5);
  ctx.fillStyle = '#a83030'; ctx.fillRect(hx+4, hy-4, 4, 2);
  busHog(ctx, hx, hy+2, 1);
  ctx.fillStyle = '#D4B896';
  ctx.fillRect(hx-1, hy+7, 2, 4); ctx.fillRect(hx+11, hy+7, 2, 4);
  ctx.fillRect(hx+1, hy+12, 3, 4); ctx.fillRect(hx+8, hy+12, 3, 4);
  ctx.save();
  ctx.font = 'bold 6px "Press Start 2P"'; ctx.fillStyle = '#1a1a1a'; ctx.textAlign = 'left';
  ctx.fillText('WHEN LIFE GIVES', x+8,  y+22);
  ctx.fillText('YOU LEMONS,',     x+8,  y+33);
  ctx.fillStyle = '#F9BD2B';
  ctx.fillText('WHEN LIFE GIVES', x+7,  y+21);
  ctx.fillText('YOU LEMONS,',     x+7,  y+32);
  ctx.font = '5px "Press Start 2P"'; ctx.fillStyle = '#fff';
  ctx.fillText('PostHog', x+8, y+43);
  ctx.restore();
  ctx.fillStyle = '#2a4a6a'; ctx.fillRect(x+2, y+8, 20, 18);
  ctx.fillStyle = '#3a5a7a'; ctx.fillRect(x+3, y+9, 18, 16);
  ctx.fillStyle = '#ffe060'; ctx.fillRect(x+2, y+28, 8, 6);
  ctx.fillStyle = '#ff4444'; ctx.fillRect(x+2, y+36, 8, 4);
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x+W-22, y+4, 20, 10);
  ctx.font = '5px "Press Start 2P"'; ctx.fillStyle = '#F9BD2B'; ctx.textAlign = 'left';
  ctx.fillText('38', x+W-18, y+12);
  ctx.fillStyle = '#2a7ab0'; ctx.fillRect(x+W/2-3, y+8, 6, H-12);
  ctx.fillStyle = '#1a6aa0'; ctx.fillRect(x+W/2-1, y+8, 2, H-12);
}

function drawBusRed(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  const W = 180, H = 52, x = bx, y = by - 10;
  ctx.fillStyle = '#c91010'; ctx.fillRect(x, y+8, W, H-8);
  ctx.fillStyle = '#c91010'; ctx.fillRect(x+4, y+4, W-8, 8);
  ctx.fillStyle = '#e02020'; ctx.fillRect(x, y+8, W, 2);
  ctx.fillStyle = '#8a0a0a'; ctx.fillRect(x, y+H-4, W, 4);
  const wy = y + H - 2;
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(x+14, wy-12, 28, 14); ctx.fillRect(x+W-42, wy-12, 28, 14);
  ctx.beginPath(); ctx.arc(x+28,   wy, 12, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+W-28, wy, 12, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#ccc';
  ctx.beginPath(); ctx.arc(x+28,   wy, 6, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+W-28, wy, 6, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#888';
  ctx.beginPath(); ctx.arc(x+28,   wy, 3, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x+W-28, wy, 3, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#1a2a3a'; ctx.fillRect(x+4, y+8, W-8, 18);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = '#2a3a4a'; ctx.fillRect(x+10+i*32, y+10, 26, 14);
    ctx.fillStyle = '#3a4a5a'; ctx.fillRect(x+11+i*32, y+11, 24, 12);
  }
  const adX = x+52, adY = y+26, adW = W-62, adH = H-34;
  ctx.fillStyle = '#c91010'; ctx.fillRect(adX, adY, adW, adH);
  busHog(ctx, adX+2, adY, 1);
  ctx.save();
  ctx.font = 'bold 6px "Press Start 2P"'; ctx.fillStyle = '#ffffff'; ctx.textAlign = 'left';
  ctx.shadowColor = '#000'; ctx.shadowBlur = 1;
  ctx.fillText("WHO'S YOUR", adX+18, adY+11);
  ctx.font = 'bold 7px "Press Start 2P"'; ctx.fillStyle = '#F9BD2B';
  ctx.fillText("DADD AI?!", adX+18, adY+23);
  ctx.restore();
  ctx.font = '4px "Press Start 2P"'; ctx.fillStyle = '#F9BD2B'; ctx.textAlign = 'left';
  ctx.fillText('PostHog', x+W-28, y+42);
  ctx.fillStyle = '#1a2a3a'; ctx.fillRect(x+2, y+8, 20, 18);
  ctx.fillStyle = '#2a3a4a'; ctx.fillRect(x+3, y+9, 18, 16);
  ctx.fillStyle = '#ffe060'; ctx.fillRect(x+2, y+28, 8, 6);
  ctx.fillStyle = '#ff4444'; ctx.fillRect(x+2, y+36, 8, 4);
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(x+W-22, y+4, 20, 10);
  ctx.font = '5px "Press Start 2P"'; ctx.fillStyle = '#F9BD2B'; ctx.textAlign = 'left';
  ctx.fillText('38', x+W-18, y+12);
  ctx.fillStyle = '#aa0808'; ctx.fillRect(x+W/2-3, y+8, 6, H-12);
  ctx.fillStyle = '#880606'; ctx.fillRect(x+W/2-1, y+8, 2, H-12);
}
