import { useEffect } from 'react';

export function HowToPlay({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); onStart(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStart]);

  return (
    <div className="screen-wrap" style={{ position: 'absolute', inset: 0, background: '#1a1a1a' }}>
      <div className="screen-header" style={{ flexDirection: 'column', gap: 8 }}>
        <div className="screen-title">HOGPATCH: THE GAME</div>
      </div>
      <div className="panel htp-panel">
        <div className="inst-row">
          <div className="inst-keys">
            <span className="key">↑</span><span className="key">↓</span>
            <span className="key">←</span><span className="key">→</span>
            <span className="key">W</span><span className="key">A</span>
            <span className="key">S</span><span className="key">D</span>
          </div>
          <div className="inst-desc">Move your character</div>
        </div>
        <div className="inst-row">
          <div className="inst-keys"><span className="key">SPACE</span><span className="key">ENTER</span></div>
          <div className="inst-desc">Interact with NPCs and objects</div>
        </div>
        <div className="inst-row">
          <div className="inst-keys"><span className="key">ESC</span></div>
          <div className="inst-desc">Close dialogue / return to lobby</div>
        </div>
      </div>
      <div className="htp-lore">
        Hey fellow human! Welcome to HogPatch.<br />
        Learn more about what life here is about.<br />
        Walk around, explore, have fun and apply!
      </div>
      <button className="btn-primary" onClick={onStart} autoFocus>
        VISIT HOGPATCH →
      </button>
      <div style={{ marginTop: 12, textAlign: 'center', fontFamily: '"Press Start 2P"', fontSize: 7, color: '#555', lineHeight: 1.8 }}>
        Built with ♥ and good vibes only<br />
        at the Barbados Offsite Hackathon 2026.
      </div>
    </div>
  );
}
