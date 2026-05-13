import { useEffect, useRef } from 'react';
import { UPDATE_MS } from '../constants/config';

export type UpdateFn = (dt: number) => void;
export type RenderFn = (alpha: number) => void;

export type GameLoopHandle = {
  registerUpdate: (fn: UpdateFn) => void;
  registerRender: (fn: RenderFn) => void;
  unregisterUpdate: (fn: UpdateFn) => void;
  unregisterRender: (fn: RenderFn) => void;
};

export function useGameLoop(): GameLoopHandle {
  const rafRef      = useRef<number | null>(null);
  const updateFns   = useRef<Set<UpdateFn>>(new Set());
  const renderFns   = useRef<Set<RenderFn>>(new Set());
  const lastTimeRef = useRef<number>(0);
  const accumRef    = useRef<number>(0);

  useEffect(() => {
    function loop(timestamp: number) {
      const elapsed = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Cap elapsed to prevent spiral-of-death on tab focus
      accumRef.current += Math.min(elapsed, 250);

      while (accumRef.current >= UPDATE_MS) {
        updateFns.current.forEach((fn) => fn(UPDATE_MS));
        accumRef.current -= UPDATE_MS;
      }

      const alpha = accumRef.current / UPDATE_MS;
      renderFns.current.forEach((fn) => fn(alpha));

      rafRef.current = requestAnimationFrame(loop);
    }

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return {
    registerUpdate:   (fn) => { updateFns.current.add(fn); },
    registerRender:   (fn) => { renderFns.current.add(fn); },
    unregisterUpdate: (fn) => { updateFns.current.delete(fn); },
    unregisterRender: (fn) => { renderFns.current.delete(fn); },
  };
}
