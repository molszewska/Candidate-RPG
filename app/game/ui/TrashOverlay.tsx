import { useEffect, useRef } from 'react';
import { useGameStore } from '../state/gameStore.client';
import { DLG } from '../data/dialogue';
import { TRASH_FILES, TRASH_ARCHIVE } from '../data/areas';

export function TrashOverlay() {
  const area = useGameStore((s) => s.area);
  const setDialogue = useGameStore((s) => s.setDialogue);
  const setArea = useGameStore((s) => s.setArea);
  const trackTrashFile = useGameStore((s) => s.trackTrashFile);
  const unlockAchievement = useGameStore((s) => s.unlockAchievement);
  const containerRef = useRef<HTMLDivElement>(null);

  const openFile = (dlg: string) => {
    if (DLG[dlg]) {
      if (DLG[dlg].ach) unlockAchievement(DLG[dlg].ach!.id, DLG[dlg].ach!.name);
      setDialogue(dlg);
    }
    trackTrashFile(dlg);
  };

  useEffect(() => {
    if (area !== 'trash') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'ArrowDown' && e.code !== 'ArrowUp') return;
      e.preventDefault();
      const btns = Array.from(containerRef.current?.querySelectorAll('button') ?? []) as HTMLElement[];
      const idx = btns.indexOf(document.activeElement as HTMLElement);
      const next = e.code === 'ArrowDown'
        ? (idx + 1) % btns.length
        : (idx - 1 + btns.length) % btns.length;
      btns[next]?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [area]);

  if (area !== 'trash') return null;

  return (
    <div ref={containerRef} style={{
      display: 'block', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      background: '#0a0a0a', zIndex: 4, overflowY: 'auto', pointerEvents: 'all',
    }}>
      <div style={{ padding: '18px 24px', fontFamily: "'Press Start 2P', monospace" }}>
        <div style={{ fontSize: 9, color: '#F9BD2B', marginBottom: 4, letterSpacing: 2 }}>
          📁 THE TRASH FOLDER
        </div>
        <div style={{ fontFamily: 'VT323, monospace', fontSize: 14, color: '#555', marginBottom: 16 }}>
          system/posthog/.trash/
        </div>

        <div style={{ fontSize: 7, color: '#F9BD2B', marginBottom: 8, letterSpacing: 1 }}>RECENTLY DELETED</div>
        <div style={{ marginBottom: 18 }}>
          {TRASH_FILES.map((f, i) => (
            <FileRow key={f.dlg} label={f.label} onOpen={() => openFile(f.dlg)} autoFocus={i === 0} />
          ))}
        </div>

        <div style={{ fontSize: 7, color: '#555', marginBottom: 8, letterSpacing: 1 }}>ARCHIVE (cannot be recovered)</div>
        <div style={{ marginBottom: 18 }}>
          {TRASH_ARCHIVE.map((f) => (
            <FileRow key={f.dlg} label={f.label} onOpen={() => openFile(f.dlg)} />
          ))}
        </div>

        <button
          onClick={() => setArea('hogpatch')}
          style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: 7, padding: '8px 14px',
            background: 'transparent', border: '1px solid #333', color: '#555', cursor: 'pointer', letterSpacing: 1,
          }}
        >
          ← CLIMB BACK OUT
        </button>
      </div>
    </div>
  );
}

function FileRow({ label, onOpen, autoFocus }: { label: string; onOpen: () => void; autoFocus?: boolean }) {
  return (
    <button
      onClick={onOpen}
      autoFocus={autoFocus}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0',
        borderBottom: '1px solid #1a1a1a', cursor: 'pointer', width: '100%',
        background: 'transparent', border: 'none', borderBottom: '1px solid #1a1a1a',
        textAlign: 'left', outline: 'none',
      }}
      onFocus={(e) => (e.currentTarget.querySelector('span:last-child') as HTMLElement).style.color = '#F9BD2B'}
      onBlur={(e) => (e.currentTarget.querySelector('span:last-child') as HTMLElement).style.color = '#888'}
    >
      <span style={{ fontSize: 16, fontFamily: 'VT323, monospace' }}>📄</span>
      <span style={{ fontFamily: 'VT323, monospace', fontSize: 17, color: '#888' }}>{label}</span>
    </button>
  );
}
