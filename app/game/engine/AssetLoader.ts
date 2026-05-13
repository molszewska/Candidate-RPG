const ASSET_PATHS = [
  '/assets/game/tilesets/world.png',
  '/assets/game/tilesets/interior.png',
  '/assets/game/sprites/player.png',
  '/assets/game/sprites/npcs/max.png',
  '/assets/game/sprites/npcs/workshop-npc.png',
  '/assets/game/sprites/npcs/dump-zone-npc.png',
  '/assets/game/ui/portrait-frame.png',
] as const;

// 1×1 magenta fallback for missing assets
const FALLBACK_SRC =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';

export type AssetKey = (typeof ASSET_PATHS)[number];

export class AssetLoader {
  private images = new Map<string, HTMLImageElement>();

  async load(onProgress?: (pct: number) => void): Promise<void> {
    const total = ASSET_PATHS.length;
    let loaded = 0;

    const loadOne = (path: string): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.images.set(path, img);
          loaded++;
          onProgress?.(loaded / (total + 1)); // +1 reserves slot for fonts
          resolve();
        };
        img.onerror = () => {
          const fallback = new Image();
          fallback.src = FALLBACK_SRC;
          this.images.set(path, fallback);
          loaded++;
          onProgress?.(loaded / (total + 1));
          resolve();
        };
        img.src = path;
      });

    await Promise.all(ASSET_PATHS.map(loadOne));
    await document.fonts.ready;
    onProgress?.(1);
  }

  get(path: AssetKey): HTMLImageElement {
    return this.images.get(path) ?? this.makeFallback();
  }

  private makeFallback(): HTMLImageElement {
    const img = new Image();
    img.src = FALLBACK_SRC;
    return img;
  }
}
