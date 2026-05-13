export const SCENE_IDS = {
  CLEARING:  'clearing',
  WORKSHOP:  'workshop',
  BURROW:    'burrow',
  DUMP_ZONE: 'dump_zone',
  STUDIO:    'studio',
  DEN:       'den',
  BAZAAR:    'bazaar',
  COUNCIL:   'council',
  VAULT:     'vault',
} as const;

export type SceneId = typeof SCENE_IDS[keyof typeof SCENE_IDS];
