import { useEffect, useState } from 'react';

type Props = {
  progress: number; // 0–1
  onDone: () => void;
};

export function LoadingScreen({ progress, onDone }: Props) {
  const [visible, setVisible] = useState(true);
  const pct = Math.round(progress * 100);

  useEffect(() => {
    if (progress >= 1) {
      // Brief pause at 100% before fading out
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(onDone, 350); // matches CSS fade duration
      return () => clearTimeout(timer);
    }
  }, [visible, onDone]);

  return (
    <div
      className="loading-screen"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        transition: 'opacity 350ms ease-out',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      <div className="loading-title">
        HogPatch
        <br />
        <span style={{ fontSize: '8px', color: 'var(--color-hp-cream)' }}>
          a posthog experience
        </span>
      </div>
      <div className="loading-bar-track">
        <div className="loading-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div
        style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '8px',
          color: 'var(--color-hp-dusk)',
        }}
      >
        {pct < 100 ? 'Loading...' : 'Ready!'}
      </div>
    </div>
  );
}
