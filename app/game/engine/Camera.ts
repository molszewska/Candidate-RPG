import { VIEWPORT_W, VIEWPORT_H, TILE_DISPLAY, CAMERA_LERP, DISPLAY_SCALE } from '../constants/config';

export class Camera {
  x = 0; // display pixels
  y = 0;

  update(playerSrcX: number, playerSrcY: number, mapTilesW: number, mapTilesH: number) {
    const maxX = Math.max(0, mapTilesW * TILE_DISPLAY - VIEWPORT_W);
    const maxY = Math.max(0, mapTilesH * TILE_DISPLAY - VIEWPORT_H);

    const targetX = playerSrcX * DISPLAY_SCALE - VIEWPORT_W / 2;
    const targetY = playerSrcY * DISPLAY_SCALE - VIEWPORT_H / 2;

    this.x += (targetX - this.x) * CAMERA_LERP;
    this.y += (targetY - this.y) * CAMERA_LERP;

    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }

  // Convert source-pixel world coords to canvas screen coords
  worldToScreen(srcX: number, srcY: number) {
    return {
      sx: Math.round(srcX * DISPLAY_SCALE - this.x),
      sy: Math.round(srcY * DISPLAY_SCALE - this.y),
    };
  }

  // Convert tile grid coords to canvas screen coords
  tileToScreen(col: number, row: number) {
    return {
      sx: Math.round(col * TILE_DISPLAY - this.x),
      sy: Math.round(row * TILE_DISPLAY - this.y),
    };
  }

  snapTo(playerSrcX: number, playerSrcY: number, mapTilesW: number, mapTilesH: number) {
    const maxX = Math.max(0, mapTilesW * TILE_DISPLAY - VIEWPORT_W);
    const maxY = Math.max(0, mapTilesH * TILE_DISPLAY - VIEWPORT_H);
    this.x = Math.max(0, Math.min(playerSrcX * DISPLAY_SCALE - VIEWPORT_W / 2, maxX));
    this.y = Math.max(0, Math.min(playerSrcY * DISPLAY_SCALE - VIEWPORT_H / 2, maxY));
  }
}
