import { useGameStore } from '../state/gameStore.client';

const ACH_MAP: Record<string, string> = {
  moisturized: '🧴 MOISTURIZED',
  quickcall: '📞 QUICK CALL',
  height: '📏 HEIGHT DISCOURSE',
  nail3000: '🔨 NAIL IT 3000',
  suit: '🕴 THE SUIT INCIDENT',
  gelato: '🍦 GELATO PROTOCOL',
  thanks_dylan: '🙏 THANKS DYLAN',
  max_loose: '🦔 MAX IS LOOSE',
  meta_egg: '🥚 META EGG',
  three_finger: '🖐 THREE FINGER RULE',
  trash_panda: '📁 TRASH PANDA',
};

export function HUD() {
  const player = useGameStore((s) => s.player);
  const areaName = useGameStore((s) => s.areaName);
  const achievements = useGameStore((s) => s.achievements);
  const nearHint = useGameStore((s) => s.nearHint);

  return (
    <div id="hud" style={{ display: 'block' }}>
      <div id="playerTag">★ {player.name}</div>
      <div id="areaTag">{areaName}</div>
      <div id="achList">
        {[...achievements].map((id) =>
          ACH_MAP[id] ? <div key={id} className="ach-pip">{ACH_MAP[id]}</div> : null
        )}
      </div>
      {nearHint && <div id="nearHint" style={{ display: 'block' }}>[ SPACE ] INTERACT</div>}
    </div>
  );
}
