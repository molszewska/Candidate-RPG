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
  hogpatch: [
    { id: 'james',   name: 'JAMES HAWKINS', x: 8,  y: 3,  dir: 2, dlg: 'james_root',   drawFn: drawJames   },
    { id: 'tim',     name: 'TIM GLASER',    x: 10, y: 6,  dir: 2, dlg: 'tim_root',     drawFn: drawTim     },
  ],
  burrow: [
    { id: 'marius',  name: 'MARIUS ANDRA',  x: 3,  y: 5,  dir: 2, dlg: 'marius_root',  drawFn: drawMarius  },
    { id: 'michael', name: 'MICHAEL M.',    x: 11, y: 5,  dir: 2, dlg: 'michael_root', drawFn: drawMichael },
  ],
  den: [
    { id: 'charles', name: 'CHARLES COOK',  x: 5,  y: 7,  dir: 2, dlg: 'charles_root', drawFn: drawCharles },
    { id: 'dylan',   name: 'DYLAN MARTIN',  x: 10, y: 5,  dir: 2, dlg: 'dylan_root',   drawFn: drawDylan   },
  ],
  vault: [
    { id: 'paul',    name: "PAUL D'AMBRA",  x: 8,  y: 10, dir: 2, dlg: 'paul_root',    drawFn: drawPaul    },
  ],
  trash: [],
};
