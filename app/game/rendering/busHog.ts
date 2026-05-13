export function busHog(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.fillStyle = '#5a3a1a';
  ctx.fillRect(x + 2*s, y,       8*s, 3*s);
  ctx.fillRect(x +   s, y + 2*s, 10*s, 3*s);
  ctx.fillStyle = '#D4B896';
  ctx.fillRect(x + 2*s, y + 4*s, 8*s, 6*s);
  ctx.fillRect(x +   s, y + 5*s, 10*s, 4*s);
  ctx.fillStyle = '#c4906a';
  ctx.fillRect(x + 3*s, y + 6*s, 4*s, 3*s);
  ctx.fillStyle = '#111';
  ctx.fillRect(x + 2*s, y + 5*s, 2*s, 2*s);
  ctx.fillRect(x + 8*s, y + 5*s, 2*s, 2*s);
  ctx.fillStyle = '#fff';
  ctx.fillRect(x + 2*s, y + 5*s, s, s);
  ctx.fillRect(x + 8*s, y + 5*s, s, s);
  ctx.fillStyle = '#111';
  ctx.fillRect(x + 5*s, y + 8*s, 2*s, s);
}
