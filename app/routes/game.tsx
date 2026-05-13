import { lazy, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { Route } from './+types/game';
import { parseRole } from '../game/constants/playerRoles';
import { HowToPlay } from '../game/ui/HowToPlay';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'HogPatch — A PostHog Experience' },
    { name: 'description', content: 'A pixel-art world built by the PostHog team.' },
  ];
}

const GameCanvas = lazy(() =>
  import('../game/engine/GameCanvas').then((m) => ({ default: m.GameCanvas }))
);

const WRAP: React.CSSProperties = {
  width: '100vw', height: '100vh',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#1a1a1a',
};

const FRAME: React.CSSProperties = {
  position: 'relative', width: 640, height: 480,
  boxShadow: '0 0 0 3px #F9BD2B, 0 0 0 6px #1a1a1a, 0 0 40px rgba(249,189,43,0.25)',
};

function Loading() {
  return (
    <div style={{ ...WRAP, fontFamily: '"Press Start 2P", monospace', fontSize: 12, color: '#F9BD2B' }}>
      Loading...
    </div>
  );
}

export default function GameRoute() {
  const [started, setStarted] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    import('../game/state/persistentStore.client').then(({ usePersistentStore }) => {
      const role = parseRole(searchParams.get('role'));
      const name = searchParams.get('name');
      const store = usePersistentStore.getState();
      store.setPlayerRole(role);
      if (name) store.setPlayerName(name.slice(0, 20));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
      <Suspense fallback={<Loading />}>
        <GameCanvas />
      </Suspense>
    </div>
  );
}
