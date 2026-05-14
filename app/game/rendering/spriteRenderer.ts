import { px, C, S } from './utils';

// ── Hedgehog sprite (used for NPCs and player species=hog) ──────────────────
export function drawHog(
  ctx: CanvasRenderingContext2D,
  bx: number, by: number,
  bodyCol: string, spineCol: string, s: number,
) {
  px(ctx, bx+4*s, by+1*s,  8*s, 2*s, spineCol);
  px(ctx, bx+3*s, by+2*s, 10*s, 3*s, spineCol);
  px(ctx, bx+2*s, by+3*s, 12*s, 3*s, spineCol);
  px(ctx, bx+2*s, by+5*s, 10*s, 2*s, spineCol);
  const sh = '#a07850';
  px(ctx, bx+5*s,  by+2*s, 2*s, s, sh); px(ctx, bx+9*s,  by+2*s, 2*s, s, sh);
  px(ctx, bx+4*s,  by+3*s, 2*s, s, sh); px(ctx, bx+8*s,  by+3*s, 2*s, s, sh);
  px(ctx, bx+12*s, by+3*s, 2*s, s, sh);
  px(ctx, bx+3*s,  by+5*s, 10*s, 7*s, bodyCol);
  px(ctx, bx+2*s,  by+6*s, 12*s, 5*s, bodyCol);
  px(ctx, bx+5*s,  by+8*s,  6*s, 4*s, C.HN);
  px(ctx, bx+4*s,  by+7*s,  2*s, 2*s, '#111');
  px(ctx, bx+10*s, by+7*s,  2*s, 2*s, '#111');
  px(ctx, bx+4*s,  by+7*s,    s,   s, '#fff');
  px(ctx, bx+10*s, by+7*s,   s,   s,  '#fff');
  px(ctx, bx+7*s,  by+10*s, 2*s,   s, '#111');
  px(ctx, bx+6*s,  by+9*s,    s, 2*s, '#b07060');
  px(ctx, bx+9*s,  by+9*s,    s, 2*s, '#b07060');
  px(ctx, bx+s,    by+7*s,  2*s, 3*s, bodyCol);
  px(ctx, bx+s,    by+9*s,  3*s,   s, bodyCol);
  px(ctx, bx+13*s, by+7*s,  2*s, 3*s, bodyCol);
  px(ctx, bx+12*s, by+9*s,  3*s,   s, bodyCol);
  px(ctx, bx+4*s,  by+12*s, 3*s, 2*s, bodyCol);
  px(ctx, bx+9*s,  by+12*s, 3*s, 2*s, bodyCol);
}

// ── Human base sprite ────────────────────────────────────────────────────────
// dir: 0=up 1=right 2=down 3=left
export function drawHuman(
  ctx: CanvasRenderingContext2D,
  bx: number, by: number,
  skin: string, hair: string,
  outfit: string, outfitStyle: string,
  dir: number, striped: boolean, tall: boolean,
) {
  const s = S;
  const legBot = tall ? 15 : 14;
  px(ctx, bx+4*s,  by+11*s, 3*s, legBot-11, '#334466');
  px(ctx, bx+9*s,  by+11*s, 3*s, legBot-11, '#334466');
  px(ctx, bx+3*s,  by+legBot*s, 4*s, s, '#111');
  px(ctx, bx+9*s,  by+legBot*s, 4*s, s, '#111');
  if (striped) {
    for (let r = 0; r < 5; r++)
      px(ctx, bx+3*s, by+(6+r)*s, 10*s, s, r%2===0 ? outfit : '#e8e8e8');
  } else {
    px(ctx, bx+3*s, by+6*s, 10*s, 5*s, outfit);
  }
  if (outfitStyle === 'suit') {
    px(ctx, bx+5*s, by+6*s, 2*s, 5*s, '#223');
    px(ctx, bx+9*s, by+6*s, 2*s, 5*s, '#223');
    px(ctx, bx+7*s, by+6*s, 2*s, 5*s, '#c94040');
  }
  if (outfitStyle === 'hoodie') {
    px(ctx, bx+3*s,  by+6*s, s, s, '#222');
    px(ctx, bx+12*s, by+6*s, s, s, '#222');
  }
  px(ctx, bx+s,    by+6*s, 2*s, 4*s, outfit);
  px(ctx, bx+13*s, by+6*s, 2*s, 4*s, outfit);
  px(ctx, bx+s,    by+9*s, 2*s, 2*s, skin);
  px(ctx, bx+13*s, by+9*s, 2*s, 2*s, skin);
  px(ctx, bx+4*s,  by+s,   8*s, 5*s, skin);
  px(ctx, bx+4*s,  by+s,   8*s, 2*s, hair);
  px(ctx, bx+3*s,  by+2*s,   s, 3*s, skin);
  px(ctx, bx+12*s, by+2*s,   s, 3*s, skin);
  if (dir === 2) {
    px(ctx, bx+5*s, by+4*s, 2*s, s, '#111');
    px(ctx, bx+9*s, by+4*s, 2*s, s, '#111');
  } else if (dir === 0) {
    px(ctx, bx+4*s, by+s,   8*s, 3*s, hair);
  } else if (dir === 1) {
    px(ctx, bx+10*s, by+4*s, 2*s, s, '#111');
  } else {
    px(ctx, bx+4*s,  by+4*s, 2*s, s, '#111');
  }
}

// ── Named NPC draw functions ─────────────────────────────────────────────────

export function drawJames(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  const skin = '#D4A882', hair = '#b03a2e', shirt = '#e8603a';
  px(ctx, bx+4*S, by+11*S, 3*S, 5, '#334466');
  px(ctx, bx+9*S, by+11*S, 3*S, 5, '#334466');
  px(ctx, bx+3*S, by+15*S, 4*S, S, '#111');
  px(ctx, bx+9*S, by+15*S, 4*S, S, '#111');
  px(ctx, bx+3*S, by+6*S, 10*S, 5*S, shirt);
  px(ctx, bx+4*S,  by+7*S, S, S, '#F9BD2B'); px(ctx, bx+5*S,  by+6*S, S, S, '#2ECC71'); px(ctx, bx+5*S,  by+8*S, S, S, '#2ECC71');
  px(ctx, bx+8*S,  by+8*S, S, S, '#F9BD2B'); px(ctx, bx+9*S,  by+7*S, S, S, '#2ECC71'); px(ctx, bx+9*S,  by+9*S, S, S, '#2ECC71');
  px(ctx, bx+12*S, by+7*S, S, S, '#F9BD2B'); px(ctx, bx+11*S, by+6*S, S, S, '#2ECC71');
  px(ctx, bx+S,    by+6*S, 2*S, 4*S, shirt); px(ctx, bx+13*S, by+6*S, 2*S, 4*S, shirt);
  px(ctx, bx+S,    by+9*S, 2*S, 2*S, skin);  px(ctx, bx+13*S, by+9*S, 2*S, 2*S, skin);
  px(ctx, bx+4*S,  by+S,   8*S, 5*S, skin);
  px(ctx, bx+4*S,  by+S,   8*S, 2*S, hair);
  px(ctx, bx+3*S,  by+0,   2*S, 2*S, hair); px(ctx, bx+7*S,  by-S,  2*S, 2*S, hair);
  px(ctx, bx+11*S, by+0,   2*S, 2*S, hair); px(ctx, bx+5*S,  by-S,  4*S,  S,  hair);
  px(ctx, bx+9*S,  by+0,   2*S,  S,  hair);
  px(ctx, bx+3*S,  by+2*S,   S, 3*S, skin); px(ctx, bx+12*S, by+2*S, S, 3*S, skin);
  px(ctx, bx+5*S,  by+4*S, 2*S,  S,  '#111'); px(ctx, bx+9*S, by+4*S, 2*S, S, '#111');
}

export function drawTim(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by+2*S, '#D4A882', '#A0824A', '#888', 'tshirt', 2, false, false);
}

export function drawMarius(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by+S, '#C8946A', '#c4a040', '#446688', 'hoodie', 2, false, false);
}

export function drawMichael(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by+2*S, '#D4A882', '#1a1a1a', '#557755', 'hoodie', 2, false, false);
}

export function drawCharles(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by, '#9a7848', '#2a1a0a', '#334455', 'suit', 2, false, false);
  px(ctx, bx+6*S, by+6*S, 4*S, S, '#E5E7E0');
}

export function drawDylan(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  const skin = '#C8946A', hair = '#1a1a1a';
  drawHuman(ctx, bx, by, skin, hair, '#884422', 'tshirt', 2, false, false);
  px(ctx, bx+4*S, by+5*S, 8*S, 2*S, '#222');
  px(ctx, bx+3*S,  by+0,  2*S, 2*S, hair);
  px(ctx, bx+11*S, by+0,  2*S, 2*S, hair);
  px(ctx, bx+5*S,  by-S,  6*S, 2*S, hair);
}

export function drawDanilo(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  const skin = '#9a7a50', hair = '#1a1a1a';
  drawHuman(ctx, bx, by, skin, hair, '#3a5a3a', 'tshirt', 2, false, false);
  // beard stubble
  px(ctx, bx+5*S,  by+5*S, 6*S, S,   '#4a2e14');
  px(ctx, bx+4*S,  by+4*S, S,   S,   '#5a3a1a');
  px(ctx, bx+11*S, by+4*S, S,   S,   '#5a3a1a');
  px(ctx, bx+5*S,  by+4*S, S,   S,   '#6a4a28');
  px(ctx, bx+10*S, by+4*S, S,   S,   '#6a4a28');
}

export function drawPaul(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  const skin = '#C09060', hair = '#1a1010';
  drawHuman(ctx, bx, by, skin, hair, '#cc7733', 'tshirt', 2, false, false);
  px(ctx, bx+14*S, by+7*S, 3*S, 5*S, '#f4e0c0');
  px(ctx, bx+14*S, by+5*S, 4*S, 3*S, '#a8d8a8');
  px(ctx, bx+13*S, by+4*S, 5*S, 2*S, '#c8e8c8');
}

export function drawMrHog(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHog(ctx, bx, by, '#e8d060', '#4a2a10', S);
  // White lab coat over lower body
  px(ctx, bx+4*S, by+9*S, 8*S, 4*S, '#e8e8e8');
  px(ctx, bx+3*S, by+10*S, 10*S, 2*S, '#e8e8e8');
  // Glasses frames
  px(ctx, bx+3*S, by+6*S, 4*S, S, '#999');
  px(ctx, bx+3*S, by+8*S, 4*S, S, '#999');
  px(ctx, bx+3*S, by+6*S, S, 3*S, '#999');
  px(ctx, bx+6*S, by+6*S, S, 3*S, '#999');
  px(ctx, bx+9*S, by+6*S, 4*S, S, '#999');
  px(ctx, bx+9*S, by+8*S, 4*S, S, '#999');
  px(ctx, bx+9*S, by+6*S, S, 3*S, '#999');
  px(ctx, bx+12*S, by+6*S, S, 3*S, '#999');
  px(ctx, bx+7*S, by+7*S, 2*S, S, '#999');
}

export function drawLandon(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by, '#D4A882', '#1a1a1a', '#3366cc', 'tshirt', 2, false, false);
  // Beard
  px(ctx, bx+5*S,  by+5*S, 6*S, S,   '#222');
  px(ctx, bx+4*S,  by+4*S, S,   S,   '#333');
  px(ctx, bx+11*S, by+4*S, S,   S,   '#333');
  px(ctx, bx+5*S,  by+4*S, S,   S,   '#2a2a2a');
  px(ctx, bx+10*S, by+4*S, S,   S,   '#2a2a2a');
  // Phone in right hand
  px(ctx, bx+13*S, by+8*S, 3*S, 2*S, '#111');
  px(ctx, bx+14*S, by+7*S, 2*S, S, '#4488ff');
}

export function drawTyler(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by, '#C09878', '#a07830', '#1a1a1a', 'hoodie', 2, false, false);
  // Subtle hoodie pocket
  px(ctx, bx+6*S, by+9*S, 4*S, 2*S, '#2a2a2a');
}

export function drawSimon(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by, '#D8C4A0', '#1a1a1a', '#2a7755', 'tshirt', 2, false, false);
  // Glasses
  px(ctx, bx+5*S, by+3*S, 2*S, S, '#555');
  px(ctx, bx+9*S, by+3*S, 2*S, S, '#555');
  px(ctx, bx+5*S, by+4*S, 2*S, S, '#555');
  px(ctx, bx+9*S, by+4*S, 2*S, S, '#555');
  px(ctx, bx+7*S, by+4*S, 2*S, S, '#555');
}

export function drawMagda(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by, '#E8C9A0', '#bb3311', '#b84470', 'tshirt', 2, false, false);
  // Clipboard in left hand
  px(ctx, bx+S, by+7*S, 3*S, 4*S, '#f0e8d0');
  px(ctx, bx+S, by+7*S, 3*S, S, '#886644');
  px(ctx, bx+2*S, by+8*S, S, 3*S, '#aaa');
}

export function drawDana(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by, '#D4B080', '#1a1a1a', '#335588', 'tshirt', 2, false, false);
}

export function drawEli(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by, '#F5CBA7', '#c8a040', '#5b2d8e', 'tshirt', 2, false, false);
}

export function drawRune(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by, '#FDDBB4', '#1a1a1a', '#c94040', 'tshirt', 2, false, false);
}

export function drawZbynek(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by, '#D4A882', '#5a3010', '#2e7d32', 'tshirt', 2, false, false);
}

export function drawAngryTwitterGuy(ctx: CanvasRenderingContext2D, bx: number, by: number) {
  drawHuman(ctx, bx, by+2*S, '#D4A882', '#e06010', '#444', 'tshirt', 2, false, false);
  // Phone held in both hands, looking down at it
  px(ctx, bx+5*S,  by+11*S, 6*S, S,   '#111');
  px(ctx, bx+5*S,  by+12*S, 6*S, 4*S, '#111');
  px(ctx, bx+6*S,  by+12*S, 4*S, 3*S, '#3af');
}

// ── Thought bubble ───────────────────────────────────────────────────────────
export function drawThoughtBubble(ctx: CanvasRenderingContext2D, bx: number, by: number, lines: string | string[]) {
  const textLines = Array.isArray(lines) ? lines : [lines];
  ctx.save();
  ctx.font = '8px "Press Start 2P"';
  ctx.textAlign = 'left';

  const maxW = Math.max(...textLines.map(l => Math.ceil(ctx.measureText(l).width)));
  const pad = 7;
  const lineH = 11;
  const bw = maxW + pad * 2;
  const bh = pad + textLines.length * lineH + pad - 3;
  const rawBubX = bx + 16 - Math.floor(bw / 2);
  const bubX = Math.max(2, Math.min(638 - bw, rawBubX));
  const bubY = Math.max(2, by - 14 - 4 - bh);

  // Ascending dots
  const dots = [
    { x: bx + 18, y: by - 5,  s: 3 },
    { x: bx + 21, y: by - 15, s: 4 },
    { x: bx + 23, y: by - 27, s: 5 },
  ];
  for (const d of dots) {
    px(ctx, d.x, d.y, d.s, d.s, '#E5E7E0');
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(d.x, d.y, d.s, 1);
    ctx.fillRect(d.x, d.y + d.s - 1, d.s, 1);
    ctx.fillRect(d.x, d.y, 1, d.s);
    ctx.fillRect(d.x + d.s - 1, d.y, 1, d.s);
  }

  // Bubble fill + border
  px(ctx, bubX, bubY, bw, bh, '#E5E7E0');
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(bubX, bubY, bw, 1);
  ctx.fillRect(bubX, bubY + bh - 1, bw, 1);
  ctx.fillRect(bubX, bubY, 1, bh);
  ctx.fillRect(bubX + bw - 1, bubY, 1, bh);

  ctx.fillStyle = '#1a1a1a';
  textLines.forEach((line, i) => {
    ctx.fillText(line, bubX + pad, bubY + pad + 7 + i * lineH);
  });
  ctx.restore();
}

// ── Ghost sprite (ghostly hedgehog) ──────────────────────────────────────────
export function drawGhost(ctx: CanvasRenderingContext2D, gx: number, gy: number, t: number) {
  ctx.save();
  ctx.globalAlpha = 0.72;
  const bob = Math.round(Math.sin(t * 0.0025) * 3);
  const bx = Math.floor(gx);
  const by = Math.floor(gy) + bob;
  // Draw the hog in ghostly pale-blue colours
  drawHog(ctx, bx, by, '#c8d8ff', '#8899cc', S);
  // Overwrite eyes with glowing blue
  px(ctx, bx + 4*S, by + 7*S, 2*S, 2*S, '#aabbff');
  px(ctx, bx + 10*S, by + 7*S, 2*S, 2*S, '#aabbff');
  ctx.restore();
}

// ── Player sprite ─────────────────────────────────────────────────────────────
export type PlayerSpec = {
  species: 'human' | 'hog';
  color: string;
  outfit: 'hoodie' | 'tshirt' | 'suit';
  dir: number;
};

export function drawPlayerSprite(ctx: CanvasRenderingContext2D, bx: number, by: number, p: PlayerSpec) {
  if (p.species === 'hog') {
    drawHog(ctx, bx, by, p.color, C.HS, S);
  } else {
    const oc = p.outfit === 'hoodie' ? '#445566' : p.outfit === 'suit' ? '#334455' : '#E5E7E0';
    drawHuman(ctx, bx, by, p.color, '#1a1a2e', oc, p.outfit, p.dir, false, false);
  }
}

// ── Preview canvas (character creator) ───────────────────────────────────────
export function drawPreview(previewCtx: CanvasRenderingContext2D, p: PlayerSpec) {
  previewCtx.imageSmoothingEnabled = false;
  previewCtx.clearRect(0, 0, 64, 64);
  previewCtx.fillStyle = '#5a8a3c';
  previewCtx.fillRect(0, 0, 64, 64);
  if (p.species === 'hog') {
    drawHog(previewCtx, 16, 10, p.color, C.HS, S);
  } else {
    const oc = p.outfit === 'hoodie' ? '#445566' : p.outfit === 'suit' ? '#334455' : '#E5E7E0';
    drawHuman(previewCtx, 16, 6, p.color, '#1a1a2e', oc, p.outfit, 2, false, false);
  }
}
