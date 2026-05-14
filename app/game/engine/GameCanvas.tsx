import { useEffect, useRef } from 'react';
import { useGameStore, PATH_TO_AREA, AREA_PATHS } from '../state/gameStore.client';
import { currentMap } from '../data/maps';
import { isSolid, getTileAct } from '../data/areas';
import { NPCS_BY_AREA } from '../data/npcs';
import { DLG } from '../data/dialogue';
import { drawMap, drawLobbyLabels } from '../rendering/tileRenderer';
import { drawPlayerSprite, drawGhost, drawThoughtBubble } from '../rendering/spriteRenderer';
import { createBus, updateBus, drawBus } from '../rendering/busRenderer';
import { px } from '../rendering/utils';
import { HUD } from '../ui/HUD';
import { DialogueBox } from '../ui/DialogueBox';
import { AchievementPopup } from '../ui/AchievementPopup';
import { YoutubeOverlay } from '../ui/YoutubeOverlay';

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
  if (!npc.name) return;
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

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const moveTimerRef = useRef(0);
  const busRef = useRef(createBus());
  const lastRef = useRef(0);
  const rafRef = useRef(0);
  const ghostRef = useRef({ x: 0, y: 0, init: false });
  const ghostAreaRef = useRef<string>('');

  // Sync area from URL on mount and on browser back/forward
  useEffect(() => {
    const applyPath = (path: string) => {
      const area = PATH_TO_AREA[path];
      if (area) useGameStore.getState().setArea(area);
      else window.history.replaceState(null, '', AREA_PATHS[useGameStore.getState().area]);
    };
    applyPath(window.location.pathname);
    const onPop = () => applyPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;

    const loop = (ts: number) => {
      const dt = ts - lastRef.current;
      lastRef.current = ts;
      const store = useGameStore.getState();

      if (!store.dialogue && !store.videoUrl) {
        moveTimerRef.current -= dt;
        if (moveTimerRef.current <= 0) {
          const { player, area } = store;
          const map = currentMap(area);
          const npcs = NPCS_BY_AREA[area];
          for (const dir of DIRS) {
            if (dir.keys.some((k) => keysRef.current[k])) {
              const nx = player.x + dir.dx, ny = player.y + dir.dy;
              if (area === 'hogpatch' && ny === 13) {
                store.updatePlayer({ dir: dir.d });
                openDlg('bus_warning');
              } else if (!isSolid(map, nx, ny) && !npcs.some((n) => n.x === nx && n.y === ny)) {
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

      const fresh = useGameStore.getState();
      if (fresh.dialogue || fresh.videoUrl) {
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

      // Snap ghost to player on first frame or area change
      const playerPx = fresh.player.x * TILE, playerPy = fresh.player.y * TILE;
      if (!ghostRef.current.init || fresh.area !== ghostAreaRef.current) {
        ghostRef.current = { x: playerPx, y: playerPy, init: true };
        ghostAreaRef.current = fresh.area;
      } else {
        ghostRef.current.x += (playerPx - ghostRef.current.x) * 0.03;
        ghostRef.current.y += (playerPy - ghostRef.current.y) * 0.03;
      }

      ctx.clearRect(0, 0, 640, 480);
      drawMap(ctx, fresh.area, currentMap(fresh.area));
      if (fresh.area === 'lobby') drawLobbyLabels(ctx);
      NPCS_BY_AREA[fresh.area].forEach((n) => drawNPC(ctx, n));
      if (fresh.area === 'trash') drawGhost(ctx, ghostRef.current.x, ghostRef.current.y, ts);
      renderPlayer(ctx, fresh.player);
      if (fresh.area === 'trash') {
        const { x: plx, y: ply } = fresh.player;
        const plBx = plx * TILE, plBy = ply * TILE;
        const nearPainting = ply <= 4 && plx >= 6 && plx <= 13;
        const nearBust = Math.abs(plx - 3) <= 2 && Math.abs(ply - 6) <= 2;
        const nearTV = Math.abs(plx - 16) <= 2 && Math.abs(ply - 6) <= 2;
        if (nearPainting) drawThoughtBubble(ctx, plBx, plBy, 'Sexy');
        else if (nearBust) drawThoughtBubble(ctx, plBx, plBy, "who's dis guy?");
        else if (nearTV) drawThoughtBubble(ctx, plBx, plBy, 'Barbie movie?');
      }
      if (fresh.area === 'lobby') {
        const { x: plx, y: ply } = fresh.player;
        const plBx = plx * TILE, plBy = ply * TILE;
        const nearJames      = Math.abs(plx - 7)  <= 2 && Math.abs(ply - 6)  <= 2;
        const nearTim        = Math.abs(plx - 11) <= 2 && Math.abs(ply - 6)  <= 2;
        const nearAppCorner  = plx >= 14 && plx <= 19 && ply >= 9  && ply <= 13;
        const nearTopSecret  = plx >= 16 && plx <= 18 && Math.abs(ply - 4)  <= 2;
        const nearCompany    = plx <= 3  && Math.abs(ply - 7)  <= 2;
        const nearStreet     = Math.abs(plx - 5) <= 2 && ply >= 11 && ply <= 13;
        if (nearJames || nearTim) drawThoughtBubble(ctx, plBx, plBy, [
          'oh, I should talk to',
          'dis guys to increase',
          'the shareholder value',
        ]);
        else if (nearAppCorner)  drawThoughtBubble(ctx, plBx, plBy, ['PostHog is SLAY,', "I'm gonna apply!"]);
        else if (nearTopSecret)  drawThoughtBubble(ctx, plBx, plBy, 'interesting...');
        else if (nearCompany)    drawThoughtBubble(ctx, plBx, plBy, 'curious how is working here!');
        else if (nearStreet)     drawThoughtBubble(ctx, plBx, plBy, 'hot dog time!');
      }
      if (fresh.area === 'hogpatch') {
        updateBus(busRef.current);
        drawBus(ctx, busRef.current, busRef.current.x, 13 * TILE);
        const { x: plx, y: ply } = fresh.player;
        const nearCreators     = Math.abs(plx - 16) <= 3 && Math.abs(ply - 2) <= 2;
        const nearAngryTwitter = Math.abs(plx - 3)  <= 2 && Math.abs(ply - 7) <= 2;
        if (nearCreators)     drawThoughtBubble(ctx, plx * TILE, ply * TILE, 'NICE, these are the coolest people');
        else if (nearAngryTwitter) drawThoughtBubble(ctx, plx * TILE, ply * TILE, 'ick');
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      const store = useGameStore.getState();
      if ((e.key === ' ' || e.key === 'Enter') && !store.dialogue) {
        e.preventDefault();
        tryInteract();
        return;
      }
      if (e.key === 'Escape' && store.dialogue) {
        const def = DLG[store.dialogue];
        if (!def?.opts?.length) store.setDialogue(null);
      }
      if (e.key === 'Escape' && !store.dialogue && store.area !== 'lobby') {
        store.setArea('lobby');
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
      <HUD />
      <DialogueBox />
      <YoutubeOverlay />
      <AchievementPopup />
    </div>
  );
}
