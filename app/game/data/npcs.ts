import type { Area } from './maps';
import {
  drawJames, drawTim, drawMarius, drawMichael,
  drawCharles, drawDylan, drawPaul,
} from '../rendering/spriteRenderer';

export type NPC = {
  id: string;
  name: string;
  x: number;
  y: number;
  dir: number;
  dlg: string;
  drawFn: (ctx: CanvasRenderingContext2D, bx: number, by: number) => void;
};

export const NPCS_BY_AREA: Record<Area, NPC[]> = {
  lobby: [
    { id: 'james', name: 'JAMES HAWKINS', x: 7,  y: 6, dir: 2, dlg: 'james_lobby', drawFn: drawJames },
    { id: 'tim',   name: 'TIM GLASER',   x: 11, y: 6, dir: 2, dlg: 'tim_lobby',   drawFn: drawTim   },
  ],
  hogpatch: [],
  burrow: [
    { id: 'marius',  name: 'MARIUS ANDRA',  x: 3,  y: 5,  dir: 2, dlg: 'marius_root',  drawFn: drawMarius  },
    { id: 'michael', name: 'MICHAEL M.',    x: 11, y: 5,  dir: 2, dlg: 'michael_root', drawFn: drawMichael },
    { id: 'dylan',   name: 'DYLAN MARTIN',  x: 5,  y: 8,  dir: 2, dlg: 'dylan_root',   drawFn: drawDylan   },
  ],
  den: [
    { id: 'charles', name: 'CHARLES COOK',  x: 5,  y: 7,  dir: 2, dlg: 'charles_root', drawFn: drawCharles },
  ],
  vault: [
    { id: 'paul',    name: "PAUL D'AMBRA",  x: 8,  y: 10, dir: 2, dlg: 'paul_root',    drawFn: drawPaul    },
  ],
  trash: [],
};
