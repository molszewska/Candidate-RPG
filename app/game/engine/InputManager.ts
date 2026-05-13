import { useInputStore } from '../state/inputStore.client';

export class InputManager {
  private onKeyDown = (e: KeyboardEvent) => {
    useInputStore.getState().pressKey(e.code);
    // Prevent arrow key page scroll while game is focused
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
      e.preventDefault();
    }
  };

  private onKeyUp = (e: KeyboardEvent) => {
    useInputStore.getState().releaseKey(e.code);
  };

  init() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
    useInputStore.getState().setTouchDevice(
      window.matchMedia('(pointer: coarse)').matches
    );
  }

  destroy() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  // Called from mobile D-pad buttons
  pressVirtualKey(code: string) {
    useInputStore.getState().pressKey(code);
  }

  releaseVirtualKey(code: string) {
    useInputStore.getState().releaseKey(code);
  }
}
