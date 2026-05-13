import { useGameStore } from '../state/gameStore.client';

export function AchievementPopup() {
  const toast = useGameStore((s) => s.achievementToast);
  if (!toast) return null;

  return (
    <div id="achievementPopup" style={{ display: 'flex' }}>
      <div className="ap-label">✦ ACHIEVEMENT UNLOCKED</div>
      <div className="ap-name">{toast.name}</div>
    </div>
  );
}
