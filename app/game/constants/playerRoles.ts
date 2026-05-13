import type { SceneId } from './sceneIds';

export const PLAYER_ROLES = {
  ENGINEERING: 'engineering',
  GTM:         'gtm',
  DESIGN:      'design',
  OPS:         'ops',
  DEFAULT:     'default',
} as const;

export type PlayerRole = typeof PLAYER_ROLES[keyof typeof PLAYER_ROLES];

export const VALID_ROLES = new Set<string>(Object.values(PLAYER_ROLES));

export function parseRole(raw: string | null): PlayerRole {
  if (raw && VALID_ROLES.has(raw)) return raw as PlayerRole;
  return PLAYER_ROLES.DEFAULT;
}

export const ROLE_SPAWN_MAP: Record<PlayerRole, { sceneId: SceneId; tileX: number; tileY: number }> = {
  engineering: { sceneId: 'workshop',  tileX: 5,  tileY: 12 },
  gtm:         { sceneId: 'clearing',  tileX: 10, tileY: 10 },
  design:      { sceneId: 'clearing',  tileX: 10, tileY: 10 },
  ops:         { sceneId: 'clearing',  tileX: 10, tileY: 10 },
  default:     { sceneId: 'clearing',  tileX: 10, tileY: 10 },
};

export const ROLE_STUB_LINES: Partial<Record<PlayerRole, string>> = {
  gtm:    "Ah, a GTM person! The Bazaar folks are still setting up, but explore while you wait.",
  design: "A design eye! The Studio treehouse is almost ready. Have a look around in the meantime.",
  ops:    "Council's on a walk. They do that. The Clearing's all yours for now.",
};
