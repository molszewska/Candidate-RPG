import { create } from 'zustand';

export type InputState = {
  heldKeys: Set<string>;
  isTouchDevice: boolean;
};

type InputActions = {
  pressKey: (code: string) => void;
  releaseKey: (code: string) => void;
  setTouchDevice: (val: boolean) => void;
  isHeld: (code: string) => boolean;
};

export const useInputStore = create<InputState & InputActions>((set, get) => ({
  heldKeys: new Set(),
  isTouchDevice: false,

  pressKey: (code) =>
    set((s) => ({ heldKeys: new Set([...s.heldKeys, code]) })),
  releaseKey: (code) =>
    set((s) => {
      const next = new Set(s.heldKeys);
      next.delete(code);
      return { heldKeys: next };
    }),
  setTouchDevice: (val) => set({ isTouchDevice: val }),
  isHeld: (code) => get().heldKeys.has(code),
}));

// Direction helpers used by the game loop
export const MOVE_KEYS = {
  up:    ['ArrowUp',    'KeyW'],
  down:  ['ArrowDown',  'KeyS'],
  left:  ['ArrowLeft',  'KeyA'],
  right: ['ArrowRight', 'KeyD'],
} as const;

export const INTERACT_KEYS = ['KeyE', 'Space', 'Enter'];
