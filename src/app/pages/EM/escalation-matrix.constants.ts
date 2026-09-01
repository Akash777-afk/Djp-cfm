// Single canonical level→color map shared by the level cards, the Escalated
// SRs table's Level / Escalation Tracking columns, the landing page's
// Escalation Matrix card, and the landing page's SR Overview card, so a
// level's color never disagrees across any of them. Exact hex values as
// specified for the L1-L6 card redesign.
export const LEVEL_COLORS: Record<number, string> = {
  1: '#E6B008',
  2: '#FFA91D',
  3: '#E48508',
  4: '#F76700',
  5: '#FB4641',
  6: '#C4060D',
};

// The "Count" overview card's own accent color — parallel to LEVEL_COLORS
// but not level-keyed, so it's kept separate rather than shoehorned into
// that map under a fake level number.
export const COUNT_TILE_COLOR = '#ED7199';

// General-purpose hex -> rgba() conversion, used both by levelColorRgba
// below (level-keyed) and directly for the Count tile's own tinted
// background (not level-keyed).
export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Derives a tinted rgba() background/border from a level's accent color,
// so tints can never fall out of sync with LEVEL_COLORS.
export function levelColorRgba(level: number, alpha: number): string {
  return hexToRgba(LEVEL_COLORS[level], alpha);
}

// Mock escalated-SR counts per level. This is the single source of truth for
// both the escalation matrix page and the landing page's overview card, so
// the two can't drift apart. Used as the fallback dashboard whenever the real
// API is unreachable — see escalation-matrix.mock.ts.
export const LEVEL_COUNTS: Record<number, number> = {
  1: 44,
  2: 192,
  3: 140,
  4: 89,
  5: 28,
  6: 0,
};

// Tile accent colors/icons are page chrome, not something any DJP API
// returns — shared by both the mock dashboard and the real one so a tile's
// look never depends on which data source built it.
export const LEVEL_ACCENTS: Record<number, string> = LEVEL_COLORS;

// L4-L6 point at the new SVG glyphs (clean single-shape vectors, no baked-in
// backdrop square) — replaces the old EMLevel4/5/6.png, whose opaque
// backdrop square meant mask-tinting turned the whole icon into a solid
// block instead of a recognizable glyph. L1-L3 keep their existing PNGs
// (already clean single-color glyphs, no replacement needed/provided).
export const LEVEL_ICONS: Record<number, string> = {
  1: '/assets/escalation-matrix/L1-recon.png',
  2: '/assets/escalation-matrix/L2-recon.png',
  3: '/assets/escalation-matrix/L3-recon.png',
  4: '/assets/escalation-matrix/level 4.svg',
  5: '/assets/escalation-matrix/level 5.svg',
  6: '/assets/escalation-matrix/Level 6.svg',
};
