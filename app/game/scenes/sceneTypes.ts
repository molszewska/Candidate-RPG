import type { SceneId } from '../constants/sceneIds';

export type SceneLayer = {
  data: number[];
};

export type SceneDoor = {
  col: number;
  row: number;
  targetScene: SceneId;
  targetTileX: number;
  targetTileY: number;
  label?: string;
};

export type BuildingLabel = {
  col: number;
  row: number;
  text: string;
};

export type SceneData = {
  id: SceneId;
  width: number;
  height: number;
  ground: SceneLayer;
  objects: SceneLayer;
  collision: SceneLayer;
  doors: SceneDoor[];
  labels: BuildingLabel[];
  spawnX: number; // source pixels
  spawnY: number;
};
