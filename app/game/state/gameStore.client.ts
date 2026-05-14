import { create } from 'zustand';
import type { Area } from '../data/maps';

export const AREA_PATHS: Record<Area, string> = {
  hogpatch: '/game/street',
  lobby:    '/game/lobby',
  burrow:   '/game/engineering',
  den:      '/game/gtm',
  vault:    '/game/company',
  trash:    '/game/top-secret',
};

export const PATH_TO_AREA: Record<string, Area> = {
  '/game/street':      'hogpatch',
  '/game/lobby':       'lobby',
  '/game/engineering': 'burrow',
  '/game/gtm':         'den',
  '/game/company':     'vault',
  '/game/top-secret':  'trash',
};

export type Screen = 'howToPlay' | 'charCreator' | 'game';

export type PlayerState = {
  species: 'human' | 'hog';
  color: string;
  outfit: 'hoodie' | 'tshirt' | 'suit';
  name: string;
  x: number;
  y: number;
  dir: number;
};

const AREA_SPAWNS: Record<Area, { x: number; y: number }> = {
  hogpatch: { x: 10, y: 7 },
  burrow:   { x: 8,  y: 10 },
  den:      { x: 8,  y: 10 },
  vault:    { x: 8,  y: 10 },
  trash:    { x: 8,  y: 10 },
  lobby:    { x: 10, y: 12 },
};

const AREA_NAMES: Record<Area, string> = {
  hogpatch: 'HOGPATCH',
  burrow:   'ENGINEERING',
  den:      'GTM',
  vault:    'COMPANY',
  trash:    'TOP SECRET',
  lobby:    'POSTHOG HQ',
};

const getInitialAchievements = (): Set<string> => {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem('hp_ach') || '[]'));
  } catch {
    return new Set<string>();
  }
};

type GameState = {
  screen: Screen;
  area: Area;
  areaName: string;
  player: PlayerState;
  dialogue: string | null;
  videoUrl: string | null;
  achievementToast: { id: string; name: string } | null;
  achievements: Set<string>;
  trashOpened: Set<string>;
  nearHint: string | false;
};

type GameActions = {
  setScreen: (s: Screen) => void;
  setArea: (a: Area) => void;
  updatePlayer: (patch: Partial<PlayerState>) => void;
  setDialogue: (key: string | null) => void;
  setVideoUrl: (url: string | null) => void;
  unlockAchievement: (id: string, name: string) => void;
  trackTrashFile: (dlg: string) => void;
  setNearHint: (v: string | false) => void;
};

const TRASH_RECENT_DLGS = [
  'trash_whitepaper', 'trash_quickcalls', 'trash_feetpics', 'trash_spicy', 'trash_contract',
];

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  screen: 'howToPlay',
  area: 'lobby',
  areaName: 'POSTHOG HQ',
  player: { species: 'human', color: '#E8B88A', outfit: 'hoodie', name: 'APPLICANT', x: 10, y: 12, dir: 2 },
  dialogue: null,
  videoUrl: null,
  achievementToast: null,
  achievements: getInitialAchievements(),
  trashOpened: new Set(),
  nearHint: false,

  setScreen: (s) => set({ screen: s }),
  setArea: (a) => {
    const prevArea = get().area;
    const LOBBY_RETURN_SPAWNS: Partial<Record<Area, { x: number; y: number; dir: number }>> = {
      burrow:   { x: 5,  y: 1,  dir: 2 },
      den:      { x: 14, y: 1,  dir: 2 },
      vault:    { x: 1,  y: 7,  dir: 1 },
      trash:    { x: 18, y: 4,  dir: 3 },
      hogpatch: { x: 5,  y: 13, dir: 0 },
    };
    const returnSpawn = a === 'lobby' ? LOBBY_RETURN_SPAWNS[prevArea] : undefined;
    const sp = returnSpawn ?? AREA_SPAWNS[a];
    set((s) => ({
      area: a,
      areaName: AREA_NAMES[a],
      player: { ...s.player, x: sp.x, y: sp.y, dir: returnSpawn?.dir ?? 2 },
    }));
    window.history.pushState(null, '', AREA_PATHS[a]);
  },
  updatePlayer: (patch) => set((s) => ({ player: { ...s.player, ...patch } })),
  setDialogue: (key) => set({ dialogue: key }),
  setVideoUrl: (url) => set({ videoUrl: url }),

  unlockAchievement: (id, name) => {
    const { achievements } = get();
    if (achievements.has(id)) return;
    const next = new Set([...achievements, id]);
    try { localStorage.setItem('hp_ach', JSON.stringify([...next])); } catch { /* noop */ }
    set({ achievements: next, achievementToast: { id, name } });
    setTimeout(() => {
      set((s) => s.achievementToast?.id === id ? { achievementToast: null } : {});
    }, 3500);
  },

  trackTrashFile: (dlg) => {
    const nextSet = new Set([...get().trashOpened, dlg]);
    set({ trashOpened: nextSet });
    if (TRASH_RECENT_DLGS.every((d) => nextSet.has(d))) {
      get().unlockAchievement('trash_panda', '📁 TRASH PANDA');
    }
  },

  setNearHint: (v) => set({ nearHint: v }),
}));
