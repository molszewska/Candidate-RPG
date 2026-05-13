import { useEffect, useRef } from 'react';
import { useGameStore } from '../state/gameStore.client';
import type { Screen } from '../state/gameStore.client';
import { currentMap } from '../data/maps';
import { isSolid, getTileAct } from '../data/areas';
import { NPCS_BY_AREA } from '../data/npcs';
import { DLG } from '../data/dialogue';
import { drawMap } from '../rendering/tileRenderer';
import { drawPlayerSprite } from '../rendering/spriteRenderer';
import { createBus, updateBus, drawBus } from '../rendering/busRenderer';
import { px } from '../rendering/utils';
import { HowToPlay } from '../ui/HowToPlay';
import { CharacterCreator } from '../ui/CharacterCreator';
import { HUD } from '../ui/HUD';
import { DialogueBox } from '../ui/DialogueBox';
import { TrashOverlay } from '../ui/TrashOverlay';
import { AchievementPopup } from '../ui/AchievementPopup';

const TILE = 32;

const DIRS = [
  { dx: 0, dy: -1, d: 0, keys: ['ArrowUp', 'w', 'W'] },
  { dx: 1,  dy: 0, d: 1, keys: ['ArrowRight', 'd', 'D'] },
  { dx: 0, dy:  1, d: 2, keys: ['ArrowDown', 's', 'S'] },
  { dx: -1, dy: 0, d: 3, keys: ['ArrowLeft', 'a', 'A'] },
];

function getFacing(player: { x: number; y: number; dir: number }) {
  const dir = DIRS.find((d) => d.d === player.dir) ?? DIRS[2];
  return { tx: player.x + dir.dx, ty: player.y + dir.dy };
}

function openDlg(key: string) {
  const store = useGameStore.getState();
  const def = DLG[key];
  if (!def) return;
  if (def.ach) store.unlockAchievement(def.ach.id, def.ach.name);
  store.setDialogue(key);
}

function tryInteract() {
  const store = useGameStore.getState();
  const { player, area } = store;
  const { tx, ty } = getFacing(player);
  const npcs = NPCS_BY_AREA[area];
  const npc = npcs.find((n) => n.x === tx && n.y === ty);
  if (npc) { openDlg(npc.dlg); return; }
  const act = getTileAct(area, tx, ty);
  if (act) { openDlg(act); return; }
  const standAct = getTileAct(area, player.x, player.y);
  if (standAct) openDlg(standAct);
}

type NPC = (typeof NPCS_BY_AREA)[keyof typeof NPCS_BY_AREA][number];

function drawNPC(ctx: CanvasRenderingContext2D, npc: NPC) {
  npc.drawFn(ctx, npc.x * TILE, npc.y * TILE);
  ctx.font = '6px "Press Start 2P"'; ctx.textAlign = 'center';
  const label = npc.name.length > 12 ? npc.name.slice(0, 12) + '…' : npc.name;
  const tw = ctx.measureText(label).width;
  px(ctx, npc.x * TILE + 16 - tw / 2 - 3, npc.y * TILE - 14, tw + 6, 11, 'rgba(14,14,14,0.8)');
  ctx.fillStyle = '#F9BD2B'; ctx.fillText(label, npc.x * TILE + 16, npc.y * TILE - 5);
  ctx.textAlign = 'left';
}

type PlayerState = ReturnType<typeof useGameStore.getState>['player'];

function renderPlayer(ctx: CanvasRenderingContext2D, player: PlayerState) {
  const bx = player.x * TILE, by = player.y * TILE;
  drawPlayerSprite(ctx, bx, by, {
    species: player.species, color: player.color, outfit: player.outfit, dir: player.dir,
  });
  ctx.font = '6px "Press Start 2P"'; ctx.textAlign = 'center';
  const nm = player.name || 'YOU';
  const tw = ctx.measureText(nm).width;
  px(ctx, bx + 16 - tw / 2 - 3, by - 14, tw + 6, 11, 'rgba(14,14,14,0.75)');
  ctx.fillStyle = '#E5E7E0'; ctx.fillText(nm, bx + 16, by - 5);
  ctx.textAlign = 'left';
}

function drawChecker(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#1a1a1a'; ctx.fillRect(0, 0, 640, 480);
  for (let ty = 0; ty < 15; ty++) {
    for (let tx = 0; tx < 20; tx++) {
      ctx.fillStyle = (tx + ty) % 2 === 0 ? '#1d3a10' : '#162e0c';
      ctx.fillRect(tx * TILE, ty * TILE, TILE, TILE);
    }
  }
}

export function GameCanvas() {
  const screen = useGameStore((s) => s.screen);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const moveTimerRef = useRef(0);
  const busRef = useRef(createBus());
  const lastRef = useRef(0);
  const rafRef = useRef(0);

  // Draw initial checkerboard
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    drawChecker(ctx);
  }, []);

  // Game loop — stable RAF, reads fresh state each frame via getState()
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    const loop = (ts: number) => {
      const dt = ts - lastRef.current;
      lastRef.current = ts;
      const store = useGameStore.getState();

      if (store.screen === 'game') {
        // Movement update
        if (!store.dialogue) {
          moveTimerRef.current -= dt;
          if (moveTimerRef.current <= 0) {
            const { player, area } = store;
            const map = currentMap(area);
            const npcs = NPCS_BY_AREA[area];
            for (const dir of DIRS) {
              if (dir.keys.some((k) => keysRef.current[k])) {
                const nx = player.x + dir.dx, ny = player.y + dir.dy;
                if (!isSolid(map, nx, ny) && !npcs.some((n) => n.x === nx && n.y === ny)) {
                  store.updatePlayer({ dir: dir.d, x: nx, y: ny });
                } else {
                  store.updatePlayer({ dir: dir.d });
                }
                moveTimerRef.current = 160;
                break;
              }
            }
          }
        }

        // Near hint
        {
          const fresh = useGameStore.getState();
          if (fresh.dialogue) {
            store.setNearHint(false);
          } else {
            const { tx, ty } = getFacing(fresh.player);
            const npcs = NPCS_BY_AREA[fresh.area];
            const hint =
              npcs.some((n) => n.x === tx && n.y === ty) ||
              !!getTileAct(fresh.area, tx, ty) ||
              !!getTileAct(fresh.area, fresh.player.x, fresh.player.y);
            store.setNearHint(hint);
          }
        }

        // Render
        const fresh = useGameStore.getState();
        ctx.clearRect(0, 0, 640, 480);
        drawMap(ctx, fresh.area, currentMap(fresh.area));
        NPCS_BY_AREA[fresh.area].forEach((n) => drawNPC(ctx, n));
        renderPlayer(ctx, fresh.player);
        if (fresh.area === 'hogpatch') {
          updateBus(busRef.current);
          drawBus(ctx, busRef.current, busRef.current.x, 13 * TILE);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      const store = useGameStore.getState();
      if (store.screen !== 'game') return;
      if ((e.key === ' ' || e.key === 'Enter') && !store.dialogue) {
        e.preventDefault();
        tryInteract();
        return;
      }
      if (e.key === 'Escape' && store.dialogue) {
        const def = DLG[store.dialogue];
        if (!def?.opts?.length) store.setDialogue(null);
      }
      if (e.key === ' ' && store.dialogue) {
        const def = DLG[store.dialogue];
        if (!def?.opts?.length) store.setDialogue(null);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative', width: 640, height: 480,
        boxShadow: '0 0 0 3px #F9BD2B, 0 0 0 6px #1a1a1a, 0 0 40px rgba(249,189,43,0.25)',
      }}
    >
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ display: 'block', imageRendering: 'pixelated' }}
      />
      {screen === 'howToPlay' && <HowToPlay />}
      {screen === 'charCreator' && <CharacterCreator />}
      {screen === 'game' && <HUD />}
      {screen === 'game' && <DialogueBox />}
      {screen === 'game' && <TrashOverlay />}
      <AchievementPopup />
    </div>
  );
}
