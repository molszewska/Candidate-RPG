import type { Route } from './+types/game';
import { GameCanvas } from '../game/engine/GameCanvas';
import { HowToPlay } from '../game/ui/HowToPlay';
import { CharacterCreator } from '../game/ui/CharacterCreator';
import { useGameStore } from '../game/state/gameStore.client';

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
  const screen = useGameStore((s) => s.screen);
  const setScreen = useGameStore((s) => s.setScreen);

  if (screen === 'howToPlay') {
    return (
      <div style={WRAP}>
        <div style={FRAME}>
          <HowToPlay onStart={() => setScreen('charCreator')} />
        </div>
      </div>
    );
  }

  if (screen === 'charCreator') {
    return (
      <div style={WRAP}>
        <div style={FRAME}>
          <CharacterCreator />
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
