import { TILE_SIZE, TILE_DISPLAY, DISPLAY_SCALE, VIEWPORT_W, VIEWPORT_H } from '../constants/config';
import { PALETTE } from '../constants/palette';
import { TILE } from '../constants/tileIds';
import { getAnimFrame, LANTERN_FRAMES, WINDOW_FRAMES, FIRE_FRAMES, WATER_FRAMES, PLAYER_WALK, PLAYER_IDLE } from './AnimationSystem';
import type { SceneLayer } from '../scenes/sceneTypes';

// Placeholder colour for each tile ID — used until real PNG tilesets are available
const TILE_COLOR: Record<number, string> = {
  [TILE.GRASS]:           '#5a8a3c',
  [TILE.GRASS_2]:         '#4d7d32',
  [TILE.GRASS_3]:         '#547a38',
  [TILE.DIRT_PATH]:       '#c8a96e',
  [TILE.DIRT_PATH_H]:     '#c8a96e',
  [TILE.DIRT_PATH_V]:     '#c8a96e',
  [TILE.DUSK_SKY]:        '#6B6B8A',
  [TILE.SHADOW]:          '#2a2a4a',
  [TILE.TREE_TL]:         '#2d6a1e',
  [TILE.TREE_TR]:         '#2d6a1e',
  [TILE.TREE_BL]:         '#1a4a10',
  [TILE.TREE_BR]:         '#1a4a10',
  [TILE.BUSH]:            '#3d7a28',
  [TILE.FLOWER]:          '#c94040',
  [TILE.WATER_1]:         '#4a6fa5',
  [TILE.WATER_2]:         '#4a6fa5',
  [TILE.WATER_3]:         '#5a7fb5',
  [TILE.WATER_4]:         '#3a5f95',
  [TILE.WALL_BROWN]:      '#8B7355',
  [TILE.WALL_DARK]:       '#6B5340',
  [TILE.ROOF_RED]:        '#c94040',
  [TILE.ROOF_PEAK]:       '#a03030',
  [TILE.DOOR_CLOSED]:     '#5a3010',
  [TILE.DOOR_OPEN]:       '#1a1a1a',
  [TILE.WINDOW_LIT]:      '#F9BD2B',
  [TILE.WINDOW_DIM]:      '#8B7355',
  [TILE.SIGN]:            '#c8a96e',
  [TILE.DUMPSTER]:        '#4a4a5a',
  [TILE.LANTERN_1]:       '#F9BD2B',
  [TILE.LANTERN_2]:       '#E5A020',
  [TILE.LANTERN_3]:       '#805010',
  [TILE.FIRE_1]:          '#c94040',
  [TILE.FIRE_2]:          '#E57020',
  [TILE.FIRE_3]:          '#F9BD2B',
  [TILE.FIRE_4]:          '#E5E7E0',
  [TILE.FLOOR_CONCRETE]:  '#888898',
  [TILE.FLOOR_WOOD]:      '#c8a050',
  [TILE.FLOOR_RUG]:       '#8a4040',
  [TILE.FLOOR_EARTH]:     '#a87850',
  [TILE.FLOOR_STONE]:     '#909090',
  [TILE.FLOOR_FLAGSTONE]: '#a09080',
  [TILE.FLOOR_VAULT]:     '#707080',
  [TILE.FLOOR_RAW]:       '#606060',
  [TILE.WALL_INTERIOR]:   '#8B7355',
  [TILE.SHELF]:           '#8B6040',
  [TILE.TABLE]:           '#a88060',
  [TILE.CHAIR]:           '#887050',
  [TILE.SERVER_RACK]:     '#505060',
  [TILE.POSTIT]:          '#F9BD2B',
  [TILE.BARREL]:          '#8B6040',
  [TILE.CRATE]:           '#c8a96e',
  [TILE.BEAN_BAG]:        '#a04040',
  [TILE.DND_BOARD]:       '#405080',
  [TILE.MOOD_BOARD]:      '#E5E7E0',
  [TILE.SKETCH]:          '#E5D7C0',
};

// Tiles that animate and which base tile IDs to cycle through
const ANIM_TILES: Partial<Record<number, { frames: number[]; fps: number }>> = {
  [TILE.LANTERN_1]: { frames: [TILE.LANTERN_1, TILE.LANTERN_2, TILE.LANTERN_3], fps: 8 },
  [TILE.WINDOW_LIT]: { frames: [TILE.WINDOW_LIT, TILE.WINDOW_DIM], fps: 2 },
  [TILE.FIRE_1]: { frames: [TILE.FIRE_1, TILE.FIRE_2, TILE.FIRE_3, TILE.FIRE_4], fps: 12 },
  [TILE.WATER_1]: { frames: [TILE.WATER_1, TILE.WATER_2, TILE.WATER_3, TILE.WATER_4], fps: 8 },
};

// Player facing directions map to sprite row in sprite sheet
const FACING_ROW: Record<string, number> = {
  down:  0,
  left:  1,
  right: 2,
  up:    3,
};

export class Renderer {
  init(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
  }

  clear(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = PALETTE.black;
    ctx.fillRect(0, 0, VIEWPORT_W, VIEWPORT_H);
  }

  drawLayer(
    ctx: CanvasRenderingContext2D,
    layer: SceneLayer,
    mapW: number,
    mapH: number,
    cameraX: number,
    cameraY: number,
    animTick: number,
  ) {
    // Only render tiles visible in the viewport (with 1-tile padding)
    const startCol = Math.max(0, Math.floor(cameraX / TILE_DISPLAY) - 1);
    const startRow = Math.max(0, Math.floor(cameraY / TILE_DISPLAY) - 1);
    const endCol   = Math.min(mapW - 1, startCol + Math.ceil(VIEWPORT_W / TILE_DISPLAY) + 2);
    const endRow   = Math.min(mapH - 1, startRow + Math.ceil(VIEWPORT_H / TILE_DISPLAY) + 2);

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const baseTile = layer.data[row * mapW + col];
        if (baseTile === 0) continue;

        const anim = ANIM_TILES[baseTile];
        const tileId = anim
          ? anim.frames[getAnimFrame(animTick, anim.frames.length, anim.fps, col + row * 3)]
          : baseTile;

        const sx = Math.round(col * TILE_DISPLAY - cameraX);
        const sy = Math.round(row * TILE_DISPLAY - cameraY);

        this.drawTilePlaceholder(ctx, tileId, sx, sy);
      }
    }
  }

  private drawTilePlaceholder(ctx: CanvasRenderingContext2D, tileId: number, sx: number, sy: number) {
    const color = TILE_COLOR[tileId] ?? '#FF00FF';
    ctx.fillStyle = color;
    ctx.fillRect(sx, sy, TILE_DISPLAY, TILE_DISPLAY);

    // Add minimal detail lines to tree tiles so they read as foliage
    if (tileId === TILE.TREE_TL || tileId === TILE.TREE_TR) {
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.fillRect(sx + 4, sy + 4, 8, 8);
    }
    if (tileId === TILE.TREE_BL || tileId === TILE.TREE_BR) {
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(sx, sy, TILE_DISPLAY, 4);
    }
    // Door frame
    if (tileId === TILE.DOOR_CLOSED || tileId === TILE.DOOR_OPEN) {
      ctx.strokeStyle = PALETTE.brown;
      ctx.lineWidth = 2;
      ctx.strokeRect(sx + 2, sy + 2, TILE_DISPLAY - 4, TILE_DISPLAY - 4);
    }
    // Building sign
    if (tileId === TILE.SIGN) {
      ctx.fillStyle = PALETTE.brown;
      ctx.fillRect(sx + 6, sy + 6, TILE_DISPLAY - 12, TILE_DISPLAY - 12);
    }
    // Dumpster "lid" line
    if (tileId === TILE.DUMPSTER) {
      ctx.fillStyle = '#333344';
      ctx.fillRect(sx + 2, sy + 2, TILE_DISPLAY - 4, 6);
    }
  }

  drawPlayer(
    ctx: CanvasRenderingContext2D,
    srcX: number,
    srcY: number,
    facing: string,
    isMoving: boolean,
    cameraX: number,
    cameraY: number,
    animTick: number,
  ) {
    const sx = Math.round(srcX * DISPLAY_SCALE - cameraX);
    const sy = Math.round(srcY * DISPLAY_SCALE - cameraY);
    const w  = TILE_SIZE * DISPLAY_SCALE;
    const h  = TILE_SIZE * DISPLAY_SCALE;

    // Placeholder hedgehog: oval body
    const cx = sx + w / 2;
    const cy = sy + h / 2;

    // Bob animation when moving
    const bobY = isMoving ? (getAnimFrame(animTick, 2, 8) === 0 ? -1 : 1) : 0;

    // Body
    ctx.fillStyle = '#888880';
    ctx.beginPath();
    ctx.ellipse(cx, cy + bobY, w * 0.38, h * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Spines (darker streaks on top)
    ctx.fillStyle = '#555550';
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(cx - 8 + i * 4, cy - 10 + bobY, 2, 6);
    }

    // Face (front / direction indicator)
    ctx.fillStyle = '#E5C8A0';
    let faceX = cx, faceY = cy + bobY;
    if (facing === 'down')  faceY += 6;
    if (facing === 'up')    faceY -= 6;
    if (facing === 'left')  faceX -= 6;
    if (facing === 'right') faceX += 6;

    ctx.beginPath();
    ctx.ellipse(faceX, faceY, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose dot
    ctx.fillStyle = '#c94040';
    ctx.beginPath();
    ctx.arc(faceX, faceY, 2, 0, Math.PI * 2);
    ctx.fill();

    // Eyes (only for down/up facing)
    if (facing === 'down') {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(faceX - 3, faceY - 1, 2, 2);
      ctx.fillRect(faceX + 1, faceY - 1, 2, 2);
    }
  }

  drawTransitionOverlay(ctx: CanvasRenderingContext2D, alpha: number) {
    if (alpha <= 0) return;
    ctx.fillStyle = `rgba(26,26,26,${alpha})`;
    ctx.fillRect(0, 0, VIEWPORT_W, VIEWPORT_H);
  }

  // Draw a building label above its entrance (placeholder until real sprites)
  drawLabel(
    ctx: CanvasRenderingContext2D,
    text: string,
    sx: number,
    sy: number,
  ) {
    ctx.font = '8px "Press Start 2P"';
    const metrics = ctx.measureText(text);
    const bw = metrics.width + 8;
    const bh = 14;
    const bx = sx - bw / 2;
    const by = sy - bh;

    ctx.fillStyle = PALETTE.black;
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = PALETTE.yellow;
    ctx.fillRect(bx, by, bw, 2);
    ctx.fillRect(bx, by + bh - 2, bw, 2);
    ctx.fillRect(bx, by, 2, bh);
    ctx.fillRect(bx + bw - 2, by, 2, bh);

    ctx.fillStyle = PALETTE.cream;
    ctx.font = '8px "Press Start 2P"';
    ctx.fillText(text, bx + 4, by + bh - 4);
  }
}
