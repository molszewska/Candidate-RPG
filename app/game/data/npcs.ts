import type { Area } from './maps';
import {
  drawJames, drawTim, drawMarius, drawMichael,
  drawCharles, drawDylan, drawDanilo, drawPaul, drawMrHog,
  drawLandon, drawTyler, drawSimon, drawMagda, drawDana,
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
    { id: 'marius',  name: 'MARIUS ANDRA',  x: 15, y: 6,  dir: 2, dlg: 'marius_root',  drawFn: drawMarius  },
    { id: 'michael', name: 'MICHAEL',       x: 11, y: 6,  dir: 2, dlg: 'michael_root', drawFn: drawMichael },
    { id: 'dylan',   name: 'DYLAN MARTIN',  x: 5,  y: 6,  dir: 2, dlg: 'dylan_root',   drawFn: drawDylan   },
    { id: 'danilo',  name: 'DANILO',        x: 3,  y: 11, dir: 2, dlg: 'danilo_root',  drawFn: drawDanilo  },
    { id: 'paul',    name: "PAUL D'AMBRA",  x: 9,  y: 11, dir: 2, dlg: 'paul_eng_root', drawFn: drawPaul   },
  ],
  den: [
    { id: 'charles', name: 'CHARLES COOK', x: 5,  y: 4,  dir: 2, dlg: 'charles_root', drawFn: drawCharles },
    { id: 'tyler',   name: 'TYLER',        x: 3,  y: 7,  dir: 2, dlg: 'tyler_root',   drawFn: drawTyler   },
    { id: 'landon',  name: 'LANDON',       x: 6,  y: 7,  dir: 2, dlg: 'landon_root',  drawFn: drawLandon  },
    { id: 'dana',    name: 'DANA',         x: 10, y: 7,  dir: 2, dlg: 'dana_root',    drawFn: drawDana    },
    { id: 'simon',   name: 'SIMON',        x: 16, y: 7,  dir: 2, dlg: 'simon_root',   drawFn: drawSimon   },
    { id: 'magda',   name: 'MAGDA',        x: 3,  y: 11, dir: 2, dlg: 'magda_root',   drawFn: drawMagda   },
  ],
  vault: [
    { id: 'mr_hog', name: 'MR. HOG', x: 17, y: 12, dir: 2, dlg: 'mr_hog', drawFn: drawMrHog },
  ],
  trash: [],
};
