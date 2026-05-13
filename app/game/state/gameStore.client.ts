import { create } from 'zustand';
import type { SceneId } from '../constants/sceneIds';
import { SCENE_IDS } from '../constants/sceneIds';

export type DialogueState = {
  isOpen: boolean;
  npcId: string;
  nodeId: string;
  lineIndex: number;
};

export type ToastItem = {
  id: string;
  text: string;
};

export type GameState = {
  sceneId: SceneId;
  playerX: number;        // source pixels
  playerY: number;
  playerFacing: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  cameraX: number;
  cameraY: number;
  dialogue: DialogueState | null;
  toastQueue: ToastItem[];
  isTransitioning: boolean;
  transitionAlpha: number; // 0=transparent, 1=black
  animTick: number;        // global animation counter, incremented each frame
};

type GameActions = {
  setScene: (id: SceneId) => void;
  setPlayerPos: (x: number, y: number) => void;
  setPlayerFacing: (dir: GameState['playerFacing']) => void;
  setIsMoving: (val: boolean) => void;
  setCameraPos: (x: number, y: number) => void;
  openDialogue: (npcId: string, nodeId: string) => void;
  closeDialogue: () => void;
  advanceDialogueLine: (nextNodeId: string | null, lineIndex: number) => void;
  enqueueToast: (toast: ToastItem) => void;
  dequeueToast: (id: string) => void;
  setTransitioning: (val: boolean, alpha?: number) => void;
  tickAnim: () => void;
};

export const useGameStore = create<GameState & GameActions>((set) => ({
  sceneId: SCENE_IDS.CLEARING,
  playerX: 10 * 16,
  playerY: 10 * 16,
  playerFacing: 'down',
  isMoving: false,
  cameraX: 0,
  cameraY: 0,
  dialogue: null,
  toastQueue: [],
  isTransitioning: false,
  transitionAlpha: 0,
  animTick: 0,

  setScene: (id) => set({ sceneId: id }),
  setPlayerPos: (x, y) => set({ playerX: x, playerY: y }),
  setPlayerFacing: (dir) => set({ playerFacing: dir }),
  setIsMoving: (val) => set({ isMoving: val }),
  setCameraPos: (x, y) => set({ cameraX: x, cameraY: y }),
  openDialogue: (npcId, nodeId) =>
    set({ dialogue: { isOpen: true, npcId, nodeId, lineIndex: 0 } }),
  closeDialogue: () => set({ dialogue: null }),
  advanceDialogueLine: (nextNodeId, lineIndex) =>
    set((s) => s.dialogue
      ? { dialogue: nextNodeId
            ? { ...s.dialogue, nodeId: nextNodeId, lineIndex: 0 }
            : { ...s.dialogue, lineIndex }
        }
      : {}
    ),
  enqueueToast: (toast) =>
    set((s) => ({ toastQueue: [...s.toastQueue, toast] })),
  dequeueToast: (id) =>
    set((s) => ({ toastQueue: s.toastQueue.filter((t) => t.id !== id) })),
  setTransitioning: (val, alpha = 0) =>
    set({ isTransitioning: val, transitionAlpha: alpha }),
  tickAnim: () => set((s) => ({ animTick: s.animTick + 1 })),
}));
