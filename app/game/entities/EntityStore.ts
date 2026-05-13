export type EntityFacing = 'up' | 'down' | 'left' | 'right';

export type Entity = {
  id: string;
  type: 'npc' | 'object' | 'player';
  sceneId: string;
  x: number;           // source pixels
  y: number;
  facing: EntityFacing;
  animFrame: number;
  animTimer: number;
  isMoving: boolean;
  dialogueId?: string;
  interactionRadius: number; // source pixels
  walkPath?: { x: number; y: number }[];
  walkPathIndex?: number;
  walkTimer?: number;
};

export class EntityStore {
  private entities = new Map<string, Entity>();

  add(entity: Entity) {
    this.entities.set(entity.id, entity);
  }

  get(id: string): Entity | undefined {
    return this.entities.get(id);
  }

  remove(id: string) {
    this.entities.delete(id);
  }

  clear() {
    this.entities.clear();
  }

  getAll(): Entity[] {
    return [...this.entities.values()];
  }

  getForScene(sceneId: string): Entity[] {
    return this.getAll().filter((e) => e.sceneId === sceneId);
  }
}
