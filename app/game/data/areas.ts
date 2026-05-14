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
  lobby:    { x: 10, y: 12 },
};

export const AREA_NAMES: Record<Area, string> = {
  hogpatch: 'HOGPATCH',
  burrow:   'ENGINEERING',
  den:      'GTM',
  vault:    'COMPANY',
  trash:    'TOP SECRET',
  lobby:    'POSTHOG HQ',
};

const SOLID_TILES: Set<number> = new Set([
  T.WALL, T.ROOF, T.BILL, T.DUMP, T.LAMP, T.STOREFRONT, T.DOOR,
  TI.SHELF, TI.DESK, TI.CHEST, TI.GLASS, TI.BOOK, TI.COUCH,
  TI.WORKBENCH, TI.PAINTING, TI.BUST,
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
    if (t === T.DOOR) return 'enter_lobby_from_street';
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
    if (t === T.DOOR)   return 'exit_area';
    if (t === TI.BOOK)  return 'vault_handbook';
    if (t === TI.GLASS) return 'action_figure';
    if (t === TI.MERCH) {
      if (ty <= 2) return 'vault_values';
      if (ty <= 6) return 'vault_culture';
      return 'vault_lore';
    }
    return null;
  }

  if (area === 'trash') {
    if (t === T.DOOR) return 'exit_area';
    if (t === TI.PAINTING) return 'onlytoes_painting';
    if (t === TI.BUST) return 'jobs_bust';
    return null;
  }

  if (area === 'lobby') {
    if (t === T.DOOR) {
      if (tx === 4  && ty <= 5)  return 'enter_engineering';
      if (tx === 14 && ty <= 5)  return 'enter_gtm';
      if (tx === 4  && ty >= 8)  return 'enter_company';
      if (tx === 14 && ty >= 8)  return 'enter_secret';
      if (tx === 6)              return 'enter_hogpatch';
    }
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
