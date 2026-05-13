import { create } from 'zustand';
import type { Area } from '../data/maps';

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
};

const AREA_NAMES: Record<Area, string> = {
  hogpatch: 'HOGPATCH',
  burrow:   'THE BURROW',
  den:      'THE DEN',
  vault:    'THE MERCH VAULT',
  trash:    'THE TRASH FOLDER',
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
  achievementToast: { id: string; name: string } | null;
  achievements: Set<string>;
  trashOpened: Set<string>;
  nearHint: boolean;
};

type GameActions = {
  setScreen: (s: Screen) => void;
  setArea: (a: Area) => void;
  updatePlayer: (patch: Partial<PlayerState>) => void;
  setDialogue: (key: string | null) => void;
  unlockAchievement: (id: string, name: string) => void;
  trackTrashFile: (dlg: string) => void;
  setNearHint: (v: boolean) => void;
};

const TRASH_RECENT_DLGS = [
  'trash_whitepaper', 'trash_quickcalls', 'trash_feetpics', 'trash_spicy', 'trash_contract',
];

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  screen: 'howToPlay',
  area: 'hogpatch',
  areaName: 'HOGPATCH',
  player: { species: 'human', color: '#E8B88A', outfit: 'hoodie', name: 'APPLICANT', x: 10, y: 7, dir: 2 },
  dialogue: null,
  achievementToast: null,
  achievements: getInitialAchievements(),
  trashOpened: new Set(),
  nearHint: false,

  setScreen: (s) => set({ screen: s }),
  setArea: (a) => {
    const sp = AREA_SPAWNS[a];
    set((s) => ({
      area: a,
      areaName: AREA_NAMES[a],
      player: { ...s.player, x: sp.x, y: sp.y, dir: 2 },
    }));
  },
  updatePlayer: (patch) => set((s) => ({ player: { ...s.player, ...patch } })),
  setDialogue: (key) => set({ dialogue: key }),

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
