import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../state/gameStore.client';
import { drawPreview } from '../rendering/spriteRenderer';
import type { PlayerSpec } from '../rendering/spriteRenderer';

const COLORS = ['#E8B88A', '#C68642', '#8D5524', '#F9BD2B', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71'];

export function CharacterCreator() {
  const player = useGameStore((s) => s.player);
  const updatePlayer = useGameStore((s) => s.updatePlayer);
  const setScreen = useGameStore((s) => s.setScreen);
  const [nameInput, setNameInput] = useState('');
  const previewRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!previewRef.current) return;
    const spec: PlayerSpec = {
      species: player.species,
      color: player.color,
      outfit: player.outfit,
      dir: 2,
    };
    drawPreview(previewRef.current.getContext('2d')!, spec);
  }, [player.species, player.color, player.outfit]);

  const begin = () => {
    const name = nameInput.toUpperCase().trim() || 'APPLICANT';
    updatePlayer({ name });
    setScreen('game');
  };

  return (
    <div className="screen-wrap" style={{ position: 'absolute', inset: 0, background: '#1a1a1a' }}>
      <div className="screen-header">
        <span className="screen-hog">🦔</span>
        <div className="screen-title">YOUR CHARACTER</div>
      </div>
      <div className="panel cc-panel">
        <div className="cc-preview">
          <canvas ref={previewRef} id="previewCanvas" width={64} height={64} />
          <div className="cc-pname">{nameInput.toUpperCase() || '???'}</div>
        </div>
        <div className="cc-options">
          <div className="cc-row">
            <div className="cc-label">SPECIES</div>
            <div className="cc-btns">
              {(['human', 'hog'] as const).map((sp) => (
                <button
                  key={sp}
                  className={`cc-btn${player.species === sp ? ' active' : ''}`}
                  onClick={() => updatePlayer({ species: sp })}
                >
                  {sp === 'human' ? 'HUMAN' : 'HEDGEHOG 🦔'}
                </button>
              ))}
            </div>
          </div>
          <div className="cc-row">
            <div className="cc-label">COLOR</div>
            <div className="cc-btns" id="swatches">
              {COLORS.map((c) => (
                <div
                  key={c}
                  className={`cc-swatch${player.color === c ? ' active' : ''}`}
                  style={{ background: c }}
                  onClick={() => updatePlayer({ color: c })}
                />
              ))}
            </div>
          </div>
          <div className="cc-row">
            <div className="cc-label">OUTFIT</div>
            <div className="cc-btns">
              {(['hoodie', 'tshirt', 'suit'] as const).map((o) => (
                <button
                  key={o}
                  className={`cc-btn${player.outfit === o ? ' active' : ''}`}
                  onClick={() => updatePlayer({ outfit: o })}
                >
                  {o === 'hoodie' ? 'HOODIE' : o === 'tshirt' ? 'T-SHIRT' : 'SUIT 🕴'}
                </button>
              ))}
            </div>
          </div>
          <div className="cc-row">
            <div className="cc-label">NAME</div>
            <input
              className="cc-input"
              placeholder="YOUR NAME..."
              maxLength={14}
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && begin()}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
            <button className="btn-primary" onClick={begin}>START GAME →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
