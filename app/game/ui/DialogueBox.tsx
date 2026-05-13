import { useEffect, useRef } from 'react';
import type { Area } from '../data/maps';
import { useGameStore } from '../state/gameStore.client';
import { DLG } from '../data/dialogue';

function executeFn(fn: string, setArea: (a: Area) => void) {
  switch (fn) {
    case 'enter_trash':    setArea('trash');    break;
    case 'enter_burrow':   setArea('burrow');   break;
    case 'enter_den':      setArea('den');      break;
    case 'enter_vault':    setArea('vault');    break;
    case 'enter_hogpatch': setArea('hogpatch'); break;
    case 'open_ga_site':   window.open('https://isgoogleanalyticsillegal.com', '_blank'); break;
    case 'open_feet':      window.open('https://posthog.com/feet-pics', '_blank'); break;
    default: break;
  }
}

export function DialogueBox() {
  const dialogue = useGameStore((s) => s.dialogue);
  const setDialogue = useGameStore((s) => s.setDialogue);
  const setArea = useGameStore((s) => s.setArea);
  const optsRef = useRef<HTMLDivElement>(null);

  const close = () => setDialogue(null);

  useEffect(() => {
    if (!dialogue) return;
    const def = DLG[dialogue];
    const hasOpts = !!(def?.opts?.length);
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') { e.preventDefault(); close(); return; }
      if (!hasOpts && (e.code === 'Enter' || e.code === 'Space')) { e.preventDefault(); close(); return; }
      if (hasOpts && (e.code === 'ArrowDown' || e.code === 'ArrowUp')) {
        e.preventDefault();
        const btns = Array.from(optsRef.current?.querySelectorAll('button') ?? []) as HTMLElement[];
        const idx = btns.indexOf(document.activeElement as HTMLElement);
        const next = e.code === 'ArrowDown'
          ? (idx + 1) % btns.length
          : (idx - 1 + btns.length) % btns.length;
        btns[next]?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialogue]);

  if (!dialogue) return null;
  const def = DLG[dialogue];
  if (!def) return null;
  const hasOpts = def.opts && def.opts.length > 0;

  return (
    <div id="dialogueBox" style={{ display: 'flex' }} onClick={hasOpts ? undefined : close}>
      <div className="dlg-sp">{def.sp}</div>
      <div className="dlg-tx">{def.tx}</div>
      {hasOpts && (
        <div className="dlg-opts" ref={optsRef}>
          {def.opts!.map((opt, i) => (
            <button
              key={i}
              className="dlg-opt"
              autoFocus={i === 0}
              onClick={(e) => {
                e.stopPropagation();
                if (opt.fn) executeFn(opt.fn, setArea);
                if (opt.n) setDialogue(opt.n);
                else close();
              }}
            >
              {opt.l}
            </button>
          ))}
        </div>
      )}
      {!hasOpts && <div className="dlg-cont">▼ SPACE / ENTER</div>}
    </div>
  );
}
