// Tile IDs map to position in the sprite sheet:
//   x = (id % TILESET_COLS) * TILE_SIZE
//   y = Math.floor(id / TILESET_COLS) * TILE_SIZE

// Ground / exterior
export const TILE = {
  // Ground
  GRASS:        0,
  GRASS_2:      1,
  GRASS_3:      2,
  DIRT_PATH:    3,
  DIRT_PATH_H:  4,
  DIRT_PATH_V:  5,
  DUSK_SKY:     6,
  SHADOW:       7,

  // Trees & nature
  TREE_TL:      8,
  TREE_TR:      9,
  TREE_BL:     10,
  TREE_BR:     11,
  BUSH:        12,
  FLOWER:      13,
  WATER_1:     14,
  WATER_2:     15,
  WATER_3:     16,
  WATER_4:     17,

  // Buildings exterior
  WALL_BROWN:  18,
  WALL_DARK:   19,
  ROOF_RED:    20,
  ROOF_PEAK:   21,
  DOOR_CLOSED: 22,
  DOOR_OPEN:   23,
  WINDOW_LIT:  24,
  WINDOW_DIM:  25,
  SIGN:        26,
  DUMPSTER:    27,

  // Lanterns & fire
  LANTERN_1:   28,
  LANTERN_2:   29,
  LANTERN_3:   30,
  FIRE_1:      31,
  FIRE_2:      32,
  FIRE_3:      33,
  FIRE_4:      34,

  // Interior floors
  FLOOR_CONCRETE: 40,
  FLOOR_WOOD:     41,
  FLOOR_RUG:      42,
  FLOOR_EARTH:    43,
  FLOOR_STONE:    44,
  FLOOR_FLAGSTONE:45,
  FLOOR_VAULT:    46,
  FLOOR_RAW:      47,

  // Interior walls & decor
  WALL_INTERIOR:  48,
  SHELF:          49,
  TABLE:          50,
  CHAIR:          51,
  SERVER_RACK:    52,
  POSTIT:         53,
  BARREL:         54,
  CRATE:          55,
  BEAN_BAG:       56,
  DND_BOARD:      57,
  MOOD_BOARD:     58,
  SKETCH:         59,
} as const;

export type TileId = typeof TILE[keyof typeof TILE];
