import { busHog } from './busHog';

export type BlimpState = { x: number; speed: number };

export function createBlimp(): BlimpState {
  return { x: -300, speed: 0.55 };
}

export function updateBlimp(blimp: BlimpState) {
  blimp.x += blimp.speed;
  if (blimp.x > 720) blimp.x = -300;
}

export function drawBlimp(ctx: CanvasRenderingContext2D, blimp: BlimpState) {
  const W = 260, H = 62;
  const x = blimp.x, y = 205; // vertically centred on canvas (480px tall)
  const cx = x + W / 2, cy = y + H / 2;
  const CAP_W = 62;

  // ── BODY ────────────────────────────────────────────────────────────────
  // Full ellipse in purple → the nose (right) and body base
  ctx.fillStyle = '#5D2E8C';
  ctx.beginPath();
  ctx.ellipse(cx, cy, W / 2, H / 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // Green tail cap on the left (rear), clipped to ellipse
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, W / 2, H / 2, 0, 0, Math.PI * 2);
  ctx.clip();

  ctx.fillStyle = '#7FB93F';
  ctx.fillRect(x, y, CAP_W, H);

  // Purple top highlight along the centre body
  ctx.fillStyle = '#7B4BB0';
  ctx.fillRect(x + CAP_W + 8, y + 4, W - CAP_W * 2 - 16, Math.round(H / 3));

  ctx.restore();

  // Shine — green on the tail cap, light purple on the nose cap
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, W / 2, H / 2, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = '#9FD25F';
  ctx.fillRect(x + 8,           y + 6, CAP_W - 20, Math.round(H / 2) - 8);
  ctx.fillStyle = '#8A5CC0';
  ctx.fillRect(x + W - CAP_W + 10, y + 6, CAP_W - 22, Math.round(H / 2) - 10);
  ctx.restore();

  // Body outline
  ctx.strokeStyle = '#3A1B5C';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, W / 2, H / 2, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Division seams — green/purple at the tail, subtle panel line near the nose
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, W / 2, H / 2, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#4F7A28';
  ctx.beginPath(); ctx.moveTo(x + CAP_W,     y); ctx.lineTo(x + CAP_W,     y + H); ctx.stroke();
  ctx.strokeStyle = '#3A1B5C';
  ctx.beginPath(); ctx.moveTo(x + W - CAP_W, y); ctx.lineTo(x + W - CAP_W, y + H); ctx.stroke();
  ctx.restore();

  // Tail fin — small rounded green protrusion on left (rear)
  ctx.fillStyle = '#7FB93F';
  ctx.beginPath();
  ctx.ellipse(x - 4, cy, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#9FD25F';
  ctx.beginPath();
  ctx.ellipse(x - 6, cy - 5, 9, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4F7A28';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(x - 4, cy, 16, 20, 0, 0, Math.PI * 2);
  ctx.stroke();

  // ── LOGO AREA ────────────────────────────────────────────────────────────
  // Hedgehog (scale 3) upper-right of body
  busHog(ctx, Math.round(cx + 32), y + 4, 3);

  // "POSTHOG" in white below the hedgehog
  ctx.save();
  ctx.font = 'bold 8px "Press Start 2P"';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText('POSTHOG', cx - 8, cy + 14);
  ctx.restore();

  // ── GONDOLA ──────────────────────────────────────────────────────────────
  const gW = 88, gH = 38;
  const gx = Math.round(cx - gW / 2), gy = y + H + 8;

  // Ropes
  ctx.strokeStyle = '#8a7030';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(gx + 16, gy); ctx.lineTo(cx - 28, y + H + 1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(gx + gW - 16, gy); ctx.lineTo(cx + 28, y + H + 1); ctx.stroke();

  // Gondola shell
  ctx.fillStyle = '#3A1B5C';
  ctx.fillRect(gx, gy, gW, gH);
  ctx.fillStyle = '#5D2E8C';
  ctx.fillRect(gx + 1, gy + 1, gW - 2, gH - 2);

  // Green lower band with POSTHOG
  ctx.fillStyle = '#7FB93F';
  ctx.fillRect(gx + 1, gy + gH - 12, gW - 2, 11);
  ctx.save();
  ctx.font = 'bold 5px "Press Start 2P"';
  ctx.fillStyle = '#111111';
  ctx.textAlign = 'center';
  ctx.fillText('POSTHOG', gx + gW / 2, gy + gH - 3);
  ctx.restore();

  // Windows
  ctx.fillStyle = '#4888d8';
  ctx.fillRect(gx + 5,  gy + 4, 20, 16);
  ctx.fillRect(gx + 30, gy + 4, 20, 16);
  ctx.fillStyle = '#72aef0';
  ctx.fillRect(gx + 6,  gy + 5, 9, 7);
  ctx.fillRect(gx + 31, gy + 5, 9, 7);

  // Pilot inside (left window)
  ctx.fillStyle = '#D4B896';
  ctx.fillRect(gx + 8,  gy + 5, 7, 6);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(gx + 7,  gy + 3, 9, 4);
  ctx.fillStyle = '#3a3a5a';
  ctx.fillRect(gx + 7,  gy + 10, 9, 8);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(gx + 9,  gy + 6, 2, 2);
  ctx.fillRect(gx + 12, gy + 6, 2, 2);
}
