import type { SceneData } from '../scenes/sceneTypes';
import type { SceneId } from '../constants/sceneIds';
import { SCENE_IDS } from '../constants/sceneIds';

// Scenes are imported directly (Vite static imports, not dynamic)
import { clearingScene } from '../scenes/clearing/clearingScene';

const SCENE_REGISTRY: Record<string, SceneData> = {
  [SCENE_IDS.CLEARING]: clearingScene,
  // Additional scenes registered here as they're built
};

export class SceneManager {
  private current: SceneData = clearingScene;

  loadScene(id: SceneId): SceneData {
    const scene = SCENE_REGISTRY[id];
    if (!scene) {
      console.warn(`Scene "${id}" not found, falling back to clearing`);
      return clearingScene;
    }
    this.current = scene;
    return scene;
  }

  getCurrentScene(): SceneData {
    return this.current;
  }

  hasScene(id: SceneId): boolean {
    return id in SCENE_REGISTRY;
  }
}
