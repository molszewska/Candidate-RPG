import { TILE } from '../../constants/tileIds';
import { SCENE_IDS } from '../../constants/sceneIds';
import type { SceneData } from '../sceneTypes';

const W = 40;
const H = 30;

// ─── Map helpers ──────────────────────────────────────────────────────────────

function make(fill: number): number[] {
  return new Array(W * H).fill(fill);
}

function set(arr: number[], col: number, row: number, val: number) {
  if (col >= 0 && col < W && row >= 0 && row < H) arr[row * W + col] = val;
}

function fill(arr: number[], c0: number, r0: number, cw: number, rh: number, val: number) {
  for (let r = r0; r < r0 + rh; r++)
    for (let c = c0; c < c0 + cw; c++)
      set(arr, c, r, val);
}

// ─── Ground layer ─────────────────────────────────────────────────────────────
// Base: grass. Add sky rows, then dirt paths.

function buildGround(): number[] {
  const g = make(TILE.GRASS);

  // Dusk sky
  fill(g, 0, 0, W, 2, TILE.DUSK_SKY);

  // Horizontal main path (east–west, rows 14–16)
  fill(g, 0, 14, W, 3, TILE.DIRT_PATH);

  // Vertical main path (north–south, cols 18–21)
  fill(g, 18, 0, 4, H, TILE.DIRT_PATH);

  // Central clearing plaza (rows 9–21, cols 12–28) — lighter grass
  fill(g, 12, 9, 17, 13, TILE.GRASS_2);

  // Re-draw path over the plaza so the cross reads clearly
  fill(g, 12, 14, 17, 3, TILE.DIRT_PATH);
  fill(g, 18, 9,  4,  13, TILE.DIRT_PATH);

  return g;
}

// ─── Objects layer ────────────────────────────────────────────────────────────
// Trees, building facades, dumpster, signs.

function buildObjects(): number[] {
  const o = make(0); // 0 = nothing

  // ── Top forest (rows 2–3), gaps at cols 18–21 (path)
  for (let c = 0; c < W; c++) {
    if (c >= 18 && c <= 21) continue;
    set(o, c, 2, TILE.TREE_TL);
    set(o, c, 3, TILE.TREE_BL);
  }

  // ── Bottom forest (rows 27–29), gaps at cols 18–21
  for (let c = 0; c < W; c++) {
    if (c >= 18 && c <= 21) continue;
    set(o, c, 27, TILE.TREE_TL);
    set(o, c, 28, TILE.TREE_BL);
    set(o, c, 29, TILE.TREE_BR);
  }

  // ── Left forest (cols 0–1), rows 4–26, gap at rows 14–16
  for (let r = 4; r <= 26; r++) {
    if (r >= 14 && r <= 16) continue;
    set(o, 0, r, TILE.TREE_TL);
    set(o, 1, r, TILE.TREE_TR);
  }

  // ── Right forest (cols 38–39), rows 4–26, gap at rows 14–16
  for (let r = 4; r <= 26; r++) {
    if (r >= 14 && r <= 16) continue;
    set(o, 38, r, TILE.TREE_TL);
    set(o, 39, r, TILE.TREE_TR);
  }

  // ── Corner tree clusters (extra density)
  // Top-left
  fill(o,  2, 4, 5, 5, TILE.TREE_TL);
  fill(o,  7, 4, 3, 3, TILE.BUSH);
  // Top-right
  fill(o, 30, 4, 5, 5, TILE.TREE_TR);
  fill(o, 35, 4, 3, 3, TILE.BUSH);
  // Bottom-left
  fill(o,  2, 22, 5, 5, TILE.TREE_BL);
  fill(o,  7, 23, 3, 3, TILE.BUSH);
  // Bottom-right
  fill(o, 30, 22, 5, 5, TILE.TREE_BR);
  fill(o, 35, 23, 3, 3, TILE.BUSH);

  // ── Workshop facade (right side, rows 10–19, cols 36–39)
  fill(o, 36, 10, 4, 3, TILE.ROOF_RED);
  set(o,  37, 10, TILE.ROOF_PEAK);
  fill(o, 36, 13, 4, 7, TILE.WALL_BROWN);
  // Door opening at rows 14–16 col 36 — leave blank (walkable gap in collision)
  set(o,  36, 14, 0);
  set(o,  36, 15, TILE.DOOR_OPEN);
  set(o,  36, 16, 0);
  // Window
  set(o,  37, 13, TILE.WINDOW_LIT);
  set(o,  39, 13, TILE.WINDOW_LIT);
  // Lantern beside door
  set(o,  36, 13, TILE.LANTERN_1);

  // ── Max's Burrow facade (left side, rows 8–17, cols 0–3)
  fill(o,  0, 8, 4, 3, TILE.ROOF_RED);
  set(o,   1, 8, TILE.ROOF_PEAK);
  fill(o,  0, 11, 4, 7, TILE.WALL_BROWN);
  // Door opening at rows 14–16 col 3
  set(o,   3, 14, 0);
  set(o,   3, 15, TILE.DOOR_OPEN);
  set(o,   3, 16, 0);
  set(o,   1, 11, TILE.WINDOW_LIT);
  set(o,   3, 11, TILE.LANTERN_1);

  // ── Studio stub (top-right, rows 2–7, cols 28–36)
  fill(o, 28, 2, 9, 2, TILE.ROOF_RED);
  fill(o, 28, 4, 9, 4, TILE.WALL_BROWN);
  set(o,  32, 7, TILE.SIGN); // "Coming soon" sign tile
  set(o,  32, 6, TILE.DOOR_CLOSED);

  // ── Council stub (top-center, rows 2–6, cols 14–17)
  fill(o, 14, 2, 4, 2, TILE.ROOF_RED);
  fill(o, 14, 4, 4, 3, TILE.WALL_BROWN);
  set(o,  15, 6, TILE.DOOR_CLOSED);
  set(o,  16, 6, TILE.SIGN);

  // ── Den stub (bottom-left, rows 22–27, cols 2–8)
  fill(o,  2, 22, 7, 2, TILE.ROOF_RED);
  fill(o,  2, 24, 7, 4, TILE.WALL_BROWN);
  set(o,   5, 24, TILE.DOOR_CLOSED);
  set(o,   5, 25, TILE.SIGN);

  // ── Bazaar stub (right upper, rows 5–10, cols 36–39)
  fill(o, 36, 5, 4, 3, TILE.ROOF_RED);
  fill(o, 36, 8, 4, 3, TILE.WALL_BROWN);
  set(o,  37, 10, TILE.DOOR_CLOSED);
  set(o,  38, 10, TILE.SIGN);

  // ── Vault stub (bottom-right, rows 22–27, cols 33–38)
  fill(o, 33, 22, 6, 2, TILE.ROOF_RED);
  fill(o, 33, 24, 6, 4, TILE.WALL_DARK);
  set(o,  35, 24, TILE.WINDOW_LIT); // Paul is visible
  set(o,  36, 27, TILE.DOOR_CLOSED);
  set(o,  36, 26, TILE.SIGN);

  // ── Dumpster (rows 25–26, cols 19–20)
  set(o, 19, 25, TILE.DUMPSTER);
  set(o, 20, 25, TILE.DUMPSTER);
  set(o, 19, 26, TILE.DUMPSTER);
  set(o, 20, 26, TILE.DUMPSTER);

  // ── Bonfire (centre, rows 14–15, cols 19–20) — represented as animated fire
  set(o, 19, 14, TILE.FIRE_1);
  set(o, 20, 14, TILE.FIRE_2);
  set(o, 19, 15, TILE.FIRE_3);
  set(o, 20, 15, TILE.FIRE_4);

  // ── Scattered flowers and bushes in the plaza
  set(o, 14, 10, TILE.FLOWER);
  set(o, 26, 10, TILE.FLOWER);
  set(o, 14, 20, TILE.FLOWER);
  set(o, 26, 20, TILE.FLOWER);
  set(o, 11, 14, TILE.BUSH);
  set(o, 29, 14, TILE.BUSH);
  set(o, 11, 15, TILE.FLOWER);
  set(o, 29, 16, TILE.FLOWER);

  return o;
}

// ─── Collision layer ──────────────────────────────────────────────────────────
// 1 = blocked, 0 = walkable

function buildCollision(): number[] {
  const c = make(0);

  // Top forest rows 2–3
  for (let col = 0; col < W; col++) {
    if (col >= 18 && col <= 21) continue; // path gap
    set(c, col, 2, 1);
    set(c, col, 3, 1);
  }

  // Bottom forest rows 27–29
  for (let col = 0; col < W; col++) {
    if (col >= 18 && col <= 21) continue;
    set(c, col, 27, 1);
    set(c, col, 28, 1);
    set(c, col, 29, 1);
  }

  // Left forest cols 0–1
  for (let row = 4; row <= 26; row++) {
    if (row >= 14 && row <= 16) continue;
    set(c, 0, row, 1);
    set(c, 1, row, 1);
  }

  // Right forest cols 38–39
  for (let row = 4; row <= 26; row++) {
    if (row >= 14 && row <= 16) continue;
    set(c, 38, row, 1);
    set(c, 39, row, 1);
  }

  // Corner tree clusters
  fill(c,  2,  4, 5, 5, 1);
  fill(c,  7,  4, 3, 3, 1);
  fill(c, 30,  4, 5, 5, 1);
  fill(c, 35,  4, 3, 3, 1);
  fill(c,  2, 22, 5, 5, 1);
  fill(c,  7, 23, 3, 3, 1);
  fill(c, 30, 22, 5, 5, 1);
  fill(c, 35, 23, 3, 3, 1);

  // Workshop facade solid — but door cols open (col 36, rows 14–16)
  fill(c, 36, 10, 4, 10, 1);
  set(c,  36, 14, 0); // door
  set(c,  36, 15, 0);
  set(c,  36, 16, 0);

  // Burrow facade solid — door col 3, rows 14–16 open
  fill(c,  0, 8, 4, 9, 1);
  set(c,   3, 14, 0);
  set(c,   3, 15, 0);
  set(c,   3, 16, 0);

  // Stubs (all doors closed = solid)
  fill(c, 28,  2, 9, 6, 1); // studio
  fill(c, 14,  2, 4, 5, 1); // council
  fill(c,  2, 22, 7, 6, 1); // den
  fill(c, 36,  5, 4, 6, 1); // bazaar
  fill(c, 33, 22, 6, 6, 1); // vault

  // Dumpster (blocks tile — player "enters" via interaction, not by walking through)
  set(c, 19, 25, 1);
  set(c, 20, 25, 1);
  set(c, 19, 26, 1);
  set(c, 20, 26, 1);

  // Bonfire (solid)
  set(c, 19, 14, 1);
  set(c, 20, 14, 1);
  set(c, 19, 15, 1);
  set(c, 20, 15, 1);

  // Perimeter sky rows fully blocked
  fill(c, 0, 0, W, 2, 1);

  return c;
}

// ─── Scene definition ─────────────────────────────────────────────────────────

export const clearingScene: SceneData = {
  id: SCENE_IDS.CLEARING,
  width:  W,
  height: H,
  ground:    { data: buildGround() },
  objects:   { data: buildObjects() },
  collision: { data: buildCollision() },
  spawnX: 19 * 16, // source pixels (centre clearing)
  spawnY: 17 * 16,
  doors: [
    {
      col: 36, row: 15,
      targetScene: SCENE_IDS.WORKSHOP,
      targetTileX: 5, targetTileY: 12,
      label: 'The Workshop',
    },
    {
      col: 3, row: 15,
      targetScene: SCENE_IDS.BURROW,
      targetTileX: 14, targetTileY: 12,
      label: "Max's Burrow",
    },
  ],
  labels: [
    { col: 38, row: 12, text: 'Workshop' },
    { col: 2,  row: 10, text: "Max's Burrow" },
    { col: 32, row: 4,  text: 'Studio (soon)' },
    { col: 16, row: 3,  text: 'Council (soon)' },
    { col: 5,  row: 22, text: 'Den (soon)' },
    { col: 38, row: 6,  text: 'Bazaar (soon)' },
    { col: 36, row: 22, text: 'Vault (soon)' },
    { col: 20, row: 24, text: 'Dumpster' },
  ],
};
