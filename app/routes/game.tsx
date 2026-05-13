import { lazy, Suspense, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import type { Route } from './+types/game';
import { parseRole } from '../game/constants/playerRoles';

export function meta(_: Route.MetaArgs) {
  return [
    { title: 'HogPatch — A PostHog Experience' },
    { name: 'description', content: 'A pixel-art world built by the PostHog team.' },
  ];
}

// Lazy-load the canvas component so it never runs during SSR
const GameCanvas = lazy(() =>
  import('../game/engine/GameCanvas').then((m) => ({ default: m.GameCanvas }))
);

// Shown by React Router during SSR and initial hydration
export function HydrateFallback() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#F9BD2B',
      }}
    >
      HogPatch
    </div>
  );
}

export default function GameRoute() {
  const [searchParams] = useSearchParams();

  // Read URL params on client mount, store in persistent state
  useEffect(() => {
    import('../game/state/persistentStore.client').then(({ usePersistentStore }) => {
      const role = parseRole(searchParams.get('role'));
      const name = searchParams.get('name');
      const store = usePersistentStore.getState();
      store.setPlayerRole(role);
      if (name) store.setPlayerName(name.slice(0, 20));
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1a1a' }}>
      <Suspense fallback={<HydrateFallback />}>
        <GameCanvas />
      </Suspense>
    </div>
  );
}
