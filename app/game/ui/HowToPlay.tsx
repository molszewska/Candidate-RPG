import { useGameStore } from '../state/gameStore.client';

export function HowToPlay() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="screen-wrap" style={{ position: 'absolute', inset: 0, background: '#1a1a1a' }}>
      <div className="screen-header">
        <span className="screen-hog">🦔</span>
        <div className="screen-title">HOGPATCH</div>
        <div className="screen-sub">— a posthog RPG</div>
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
        "Explore HogPatch. Talk to the team.<br />
        Find the dumpster. Unlock achievements.<br />
        There&apos;s no wrong answer.<br />
        Except pulling a Post-it by the corner."
      </div>
      <button className="btn-primary" onClick={() => setScreen('charCreator')}>
        CREATE YOUR CHARACTER →
      </button>
    </div>
  );
}
