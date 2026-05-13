import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PlayerRole } from '../constants/playerRoles';
import { PLAYER_ROLES } from '../constants/playerRoles';
import type { SceneId } from '../constants/sceneIds';

type CharacterColour = 'grey' | 'golden' | 'dark';

export type PersistentState = {
  playerName: string;
  playerColour: CharacterColour;
  playerRole: PlayerRole;
  characterCreated: boolean;
  unlockedAchievements: Set<string>;
  visitedScenes: Set<SceneId>;
  interactedObjects: Set<string>; // `${sceneId}:${objectId}`
  secret_message: string;
};

type PersistentActions = {
  setPlayerName: (name: string) => void;
  setPlayerColour: (colour: CharacterColour) => void;
  setPlayerRole: (role: PlayerRole) => void;
  setCharacterCreated: () => void;
  unlockAchievement: (id: string) => void;
  markSceneVisited: (id: SceneId) => void;
  markObjectInteracted: (key: string) => void;
  hasVisited: (id: SceneId) => boolean;
  hasInteracted: (key: string) => boolean;
  hasAchievement: (id: string) => boolean;
  reset: () => void;
};

const DEFAULTS: PersistentState = {
  playerName: '',
  playerColour: 'grey',
  playerRole: PLAYER_ROLES.DEFAULT,
  characterCreated: false,
  unlockedAchievements: new Set(),
  visitedScenes: new Set(),
  interactedObjects: new Set(),
  secret_message: "hey, you found the secret. the team really is this weird in person. apply anyway.",
};

export const usePersistentStore = create<PersistentState & PersistentActions>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,

      setPlayerName: (name) => set({ playerName: name }),
      setPlayerColour: (colour) => set({ playerColour: colour }),
      setPlayerRole: (role) => set({ playerRole: role }),
      setCharacterCreated: () => set({ characterCreated: true }),

      unlockAchievement: (id) =>
        set((s) => ({ unlockedAchievements: new Set([...s.unlockedAchievements, id]) })),
      markSceneVisited: (id) =>
        set((s) => ({ visitedScenes: new Set([...s.visitedScenes, id]) })),
      markObjectInteracted: (key) =>
        set((s) => ({ interactedObjects: new Set([...s.interactedObjects, key]) })),

      hasVisited: (id) => get().visitedScenes.has(id),
      hasInteracted: (key) => get().interactedObjects.has(key),
      hasAchievement: (id) => get().unlockedAchievements.has(id),

      reset: () => set(DEFAULTS),
    }),
    {
      name: 'hogpatch-persistent',
      // Custom storage handles Set ↔ Array serialisation
      storage: createJSONStorage(() => localStorage, {
        replacer: (_key, value) =>
          value instanceof Set
            ? { __type: 'Set', values: [...value] }
            : value,
        reviver: (_key, value) =>
          value && typeof value === 'object' && (value as { __type?: string }).__type === 'Set'
            ? new Set((value as { values: unknown[] }).values)
            : value,
      }),
    }
  )
);
