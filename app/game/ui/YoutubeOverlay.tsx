import { useEffect } from 'react';
import { useGameStore } from '../state/gameStore.client';

export function YoutubeOverlay() {
  const videoUrl = useGameStore((s) => s.videoUrl);
  const setVideoUrl = useGameStore((s) => s.setVideoUrl);

  useEffect(() => {
    if (!videoUrl) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); setVideoUrl(null); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [videoUrl]);

  if (!videoUrl) return null;

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        background: 'rgba(10,10,10,0.93)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 20,
      }}
      onClick={() => setVideoUrl(null)}
    >
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          fontFamily: '"Press Start 2P"', fontSize: 9,
          color: '#F9BD2B', letterSpacing: 3,
        }}>
          ★ HOG FLIX ★
        </div>
        <div style={{ boxShadow: '0 0 0 3px #F9BD2B, 0 0 0 6px #1a1a1a', lineHeight: 0 }}>
          <iframe
            width={540}
            height={304}
            src={videoUrl}
            title="HogFlix"
            frameBorder={0}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>
        <button
          style={{
            fontFamily: '"Press Start 2P"', fontSize: 7,
            color: '#888', background: 'none',
            border: '1px solid #333', padding: '5px 10px',
            cursor: 'pointer',
          }}
          onClick={() => setVideoUrl(null)}
        >
          [ turn off ]
        </button>
      </div>
    </div>
  );
}
