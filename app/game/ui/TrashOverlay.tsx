import { useGameStore } from '../state/gameStore.client';
import { DLG } from '../data/dialogue';
import { TRASH_FILES, TRASH_ARCHIVE } from '../data/areas';

export function TrashOverlay() {
  const area = useGameStore((s) => s.area);
  const setDialogue = useGameStore((s) => s.setDialogue);
  const setArea = useGameStore((s) => s.setArea);
  const trackTrashFile = useGameStore((s) => s.trackTrashFile);
  const unlockAchievement = useGameStore((s) => s.unlockAchievement);

  const openFile = (dlg: string) => {
    if (DLG[dlg]) {
      if (DLG[dlg].ach) unlockAchievement(DLG[dlg].ach!.id, DLG[dlg].ach!.name);
      setDialogue(dlg);
    }
    trackTrashFile(dlg);
  };

  if (area !== 'trash') return null;

  return (
    <div style={{
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
          {TRASH_FILES.map((f) => (
            <FileRow key={f.dlg} label={f.label} onOpen={() => openFile(f.dlg)} />
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

function FileRow({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <div
      onClick={onOpen}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0',
        borderBottom: '1px solid #1a1a1a', cursor: 'pointer',
      }}
      onMouseEnter={(e) => (e.currentTarget.querySelector('span:last-child') as HTMLElement).style.color = '#F9BD2B'}
      onMouseLeave={(e) => (e.currentTarget.querySelector('span:last-child') as HTMLElement).style.color = '#888'}
    >
      <span style={{ fontSize: 16, fontFamily: 'VT323, monospace' }}>📄</span>
      <span style={{ fontFamily: 'VT323, monospace', fontSize: 17, color: '#888' }}>{label}</span>
    </div>
  );
}
