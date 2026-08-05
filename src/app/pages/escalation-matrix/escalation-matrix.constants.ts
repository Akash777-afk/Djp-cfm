// Single canonical level→color map shared by the level tiles, the Escalated
// SRs table's Level / Escalation Tracking columns, the landing page's
// Escalation Matrix card, and the landing page's SR Overview card, so a
// level's color never disagrees across any of them.
export const LEVEL_COLORS: Record<number, string> = {
  1: '#078811',
  2: '#5cb811',
  3: '#ffb74d',
  4: '#ff8725',
  5: '#ff4124',
  6: '#d1150b',
};

// Derives a tinted rgba() background/border from a level's accent color,
// so tints can never fall out of sync with LEVEL_COLORS.
export function levelColorRgba(level: number, alpha: number): string {
  const hex = LEVEL_COLORS[level].replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Mock escalated-SR counts per level. This is the single source of truth for
// both the escalation matrix page and the landing page's overview card, so
// the two can't drift apart. Swap for a real API response once backend
// integration lands.
export const LEVEL_COUNTS: Record<number, number> = {
  1: 44,
  2: 192,
  3: 140,
  4: 89,
  5: 28,
  6: 0,
};
