// All animation is driven by the global animTick from the game loop.
// Each animation sequence defines its fps and frame count.

export function getAnimFrame(
  animTick: number,
  frameCount: number,
  fps: number,
  offset = 0, // frame offset for staggering animations
): number {
  const ticksPerFrame = Math.round(60 / fps);
  return Math.floor((animTick + offset) / ticksPerFrame) % frameCount;
}

// Specific helpers used throughout the renderer

export const LANTERN_FRAMES  = { count: 3, fps: 8  };
export const WINDOW_FRAMES   = { count: 2, fps: 2  };
export const FIRE_FRAMES     = { count: 4, fps: 12 };
export const WATER_FRAMES    = { count: 4, fps: 8  };
export const PLAYER_WALK     = { count: 3, fps: 8  };
export const PLAYER_IDLE     = { count: 2, fps: 2  };
