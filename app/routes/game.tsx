import { useState } from 'react';
import type { Route } from './+types/game';
import { GameCanvas } from '../game/engine/GameCanvas';
import { HowToPlay } from '../game/ui/HowToPlay';

export function meta(_: Route.MetaArgs) {
  return [{ title: 'HogPatch — A PostHog Experience' }];
}

const WRAP: React.CSSProperties = {
  width: '100vw', height: '100vh',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#1a1a1a',
};

const FRAME: React.CSSProperties = {
  position: 'relative', width: 640, height: 480,
  boxShadow: '0 0 0 3px #F9BD2B, 0 0 0 6px #1a1a1a, 0 0 40px rgba(249,189,43,0.25)',
};

export default function GameRoute() {
  const [started, setStarted] = useState(false);

  if (!started) {
    return (
      <div style={WRAP}>
        <div style={FRAME}>
          <HowToPlay onStart={() => setStarted(true)} />
        </div>
      </div>
    );
  }

  return (
    <div style={WRAP}>
      <GameCanvas />
    </div>
  );
}
