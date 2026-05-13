import { T, TI, currentMap } from './maps';
import type { Area, MapGrid } from './maps';

export type { Area };

export const COLS = 20;
export const ROWS = 15;

export const AREA_SPAWNS: Record<Area, { x: number; y: number }> = {
  burrow:   { x: 8, y: 10 },
  den:      { x: 8, y: 10 },
  vault:    { x: 8, y: 10 },
  trash:    { x: 8, y: 10 },
  hogpatch: { x: 10, y: 7 },
};

export const AREA_NAMES: Record<Area, string> = {
  hogpatch: 'HOGPATCH',
  burrow:   'THE BURROW',
  den:      'THE DEN',
  vault:    'THE MERCH VAULT',
  trash:    'THE TRASH FOLDER',
};

const SOLID_TILES: Set<number> = new Set([
  T.WALL, T.ROOF, T.BILL, T.DUMP, T.LAMP, T.STOREFRONT, T.DOOR,
  TI.SHELF, TI.DESK, TI.CHEST, TI.GLASS,
]);

export function isSolid(map: MapGrid, tx: number, ty: number): boolean {
  if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return true;
  return SOLID_TILES.has(map[ty][tx]);
}

// Returns a dialogue key for interacting with the tile at (tx,ty), or null
export function getTileAct(area: Area, tx: number, ty: number): string | null {
  if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return null;
  const map = currentMap(area);
  const t = map[ty][tx];

  if (area === 'hogpatch') {
    if (t === T.STAGE)  return 'stage';
    if (t === T.DUMP)   return 'dumpster';
    if (t === T.SIGN)   return 'sign';
    if (t === T.BILL)   return 'billboard';
    if (t === T.DOOR) {
      if (tx <= 7)              return 'door_burrow_enter';
      if (tx >= 9 && tx <= 12)  return 'door_den_enter';
      if (tx >= 17)             return 'door_vault_enter';
    }
    return null;
  }

  if (area === 'burrow') {
    if (t === T.DOOR)       return 'exit_area';
    if (t === TI.COMPUTER)  return 'computer_ga';
    if (t === TI.POSTIT)    return 'postit';
    if (t === TI.DESK)      return 'burrow_desk';
    return null;
  }

  if (area === 'den') {
    if (t === T.DOOR)     return 'exit_area';
    if (t === TI.CHEST)   return 'ipo_chest';
    if (t === TI.TV)      return 'ian_tv';
    if (t === TI.BEANBAG) return 'beanbag';
    return null;
  }

  if (area === 'vault') {
    if (t === T.DOOR)    return 'exit_area';
    if (t === TI.GLASS)  return 'action_figure';
    if (t === TI.MERCH)  return 'merch_shelf';
    return null;
  }

  if (area === 'trash') {
    if (t === T.DOOR) return 'exit_area';
    return null;
  }

  return null;
}

export const TRASH_FILES = [
  { label: 'whitepaper (2) - final FINAL.docx.pdf', dlg: 'trash_whitepaper' },
  { label: 'quick calls script.txt',                dlg: 'trash_quickcalls'  },
  { label: 'employee feet pics',                    dlg: 'trash_feetpics'    },
  { label: 'spicy.mov',                             dlg: 'trash_spicy'       },
  { label: 'Long Term Contract Template.docx',      dlg: 'trash_contract'    },
];

export const TRASH_ARCHIVE = [
  { label: 'Synergy Framework.canvas',             dlg: 'trash_synergy'    },
  { label: 'Sync Meeting Invite.ics',              dlg: 'trash_sync'       },
  { label: 'GA3',                                  dlg: 'trash_ga3'        },
  { label: 'PIP.doc',                              dlg: 'trash_pip'        },
  { label: 'website easter eggs.md',               dlg: 'trash_eastereggs' },
  { label: '[GATEKEEP] state of the industry.pdf', dlg: 'trash_gatekeep'   },
  { label: 'ai slop.tsx',                          dlg: 'trash_aislop'     },
];
