export function HowToPlay({ onStart }: { onStart: () => void }) {
  return (
    <div className="screen-wrap" style={{ position: 'absolute', inset: 0, background: '#1a1a1a' }}>
      <div className="screen-header" style={{ flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="screen-hog">🦔</span>
          <div className="screen-title">HOGPATCH</div>
        </div>
        <div className="screen-sub" style={{ opacity: 1, fontSize: 20, marginLeft: 0 }}>a PostHog RPG</div>
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
          <div className="inst-desc">Close dialogue</div>
        </div>
      </div>
      <div className="htp-lore">
        Hey fellow human! Welcome to HogPatch.<br />
        Learn more about what life here is about.<br />
        Walk around, explore, have fun!
      </div>
      <button className="btn-primary" onClick={onStart}>
        VISIT HOGPATCH →
      </button>
    </div>
  );
}
