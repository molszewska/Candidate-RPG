import { TILE_SIZE } from '../constants/config';
import type { CollisionSystem } from '../engine/CollisionSystem';
import type { EntityFacing } from './EntityStore';
import { MOVE_KEYS } from '../state/inputStore.client';

const SPEED   = 1.2;  // source pixels per update tick (~4.5 tiles/sec at 60fps)
const COL_W   = 10;   // collision box width in source pixels
const COL_H   = 7;    // collision box height in source pixels
const COL_OX  = 3;    // offset from sprite left
const COL_OY  = 9;    // offset from sprite top (lower half = "feet")

export type PlayerUpdateResult = {
  x: number;
  y: number;
  facing: EntityFacing;
  isMoving: boolean;
};

export class PlayerEntity {
  update(
    currentX: number,
    currentY: number,
    heldKeys: Set<string>,
    collision: CollisionSystem,
  ): PlayerUpdateResult {
    const up    = MOVE_KEYS.up.some((k)    => heldKeys.has(k));
    const down  = MOVE_KEYS.down.some((k)  => heldKeys.has(k));
    const left  = MOVE_KEYS.left.some((k)  => heldKeys.has(k));
    const right = MOVE_KEYS.right.some((k) => heldKeys.has(k));

    const isMoving = up || down || left || right;

    // Diagonal normalisation
    const dx = (right ? 1 : 0) - (left ? 1 : 0);
    const dy = (down  ? 1 : 0) - (up   ? 1 : 0);
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx  = len > 0 ? dx / len : 0;
    const ny  = len > 0 ? dy / len : 0;

    let newX = currentX;
    let newY = currentY;

    // Per-axis collision resolution
    const tryX = currentX + nx * SPEED;
    if (nx !== 0 && collision.boxWalkable(
      tryX + COL_OX,
      newY  + COL_OY,
      tryX + COL_OX + COL_W,
      newY  + COL_OY + COL_H,
    )) {
      newX = tryX;
    }

    const tryY = newY + ny * SPEED;
    if (ny !== 0 && collision.boxWalkable(
      newX + COL_OX,
      tryY  + COL_OY,
      newX + COL_OX + COL_W,
      tryY  + COL_OY + COL_H,
    )) {
      newY = tryY;
    }

    // Map boundary clamp
    newX = Math.max(0, newX);
    newY = Math.max(0, newY);

    // Facing direction (last held key wins; prioritise vertical)
    let facing: EntityFacing = 'down';
    if (right) facing = 'right';
    if (left)  facing = 'left';
    if (down)  facing = 'down';
    if (up)    facing = 'up';

    return { x: newX, y: newY, facing, isMoving };
  }
}
