import { TILE_SIZE } from '../constants/config';

export class CollisionSystem {
  private data: number[]  = [];
  private width  = 0;
  private height = 0;

  init(collisionLayer: number[], width: number, height: number) {
    this.data   = collisionLayer;
    this.width  = width;
    this.height = height;
  }

  // Check whether a single source-pixel point is in a walkable tile
  isWalkable(srcX: number, srcY: number): boolean {
    const col = Math.floor(srcX / TILE_SIZE);
    const row = Math.floor(srcY / TILE_SIZE);
    if (col < 0 || col >= this.width || row < 0 || row >= this.height) return false;
    return this.data[row * this.width + col] === 0;
  }

  // Check all four corners of a collision box
  boxWalkable(
    left: number,
    top: number,
    right: number,
    bottom: number,
  ): boolean {
    return (
      this.isWalkable(left,  top)    &&
      this.isWalkable(right, top)    &&
      this.isWalkable(left,  bottom) &&
      this.isWalkable(right, bottom)
    );
  }
}
