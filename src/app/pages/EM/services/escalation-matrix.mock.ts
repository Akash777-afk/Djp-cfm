import { EscalationLevelTile } from '../components/escalation-levels/escalation-levels.component';
import { EscalatedSrRow, SrType } from '../components/escalated-srs/escalated-srs.component';
import { COUNT_TILE_COLOR, hexToRgba, LEVEL_COLORS, LEVEL_COUNTS, LEVEL_ICONS, levelColorRgba } from '../escalation-matrix.constants';
import { EscalationDashboardData } from './escalation-matrix.types';

// Fallback dashboard data — used by EscalationMatrixService whenever the real
// API is unreachable (see its catchError), so the page still demos instead of
// showing a hard error. This is the exact same mock content that used to live
// directly in escalation-matrix.component.ts before real API integration.
function buildMockLevelTiles(): EscalationLevelTile[] {
  const totalEscalatedCount = Object.values(LEVEL_COUNTS).reduce((sum, count) => sum + count, 0);
  const tiles: EscalationLevelTile[] = [
    { key: 'all', label: 'Total Count', value: totalEscalatedCount, accent: COUNT_TILE_COLOR, bg: hexToRgba(COUNT_TILE_COLOR, 0.08), icon: '/assets/escalation-matrix/Allcount.svg', filledDots: 0, pillText: 'All Escalated SRs' },
  ];
  for (let level = 1; level <= 6; level++) {
    tiles.push({
      key: `level-${level}`,
      label: `Level ${level}`,
      value: LEVEL_COUNTS[level],
      accent: LEVEL_COLORS[level],
      bg: levelColorRgba(level, 0.06),
      icon: LEVEL_ICONS[level],
      filledDots: level,
    });
  }
  return tiles;
}

// Call Escalation Tracking mock values — 6 small per-level call-history
// counts for one SR (mirrors the real getEscalationsCallCount response
// shape: level1_Count..level6_Count). This row's own level always shows
// some history; a neighboring level occasionally shows a little too,
// everything else stays 0 — varied enough to look like real call history
// without inventing implausibly large numbers.
function buildMockLevelCounts(level: number, seed: number): number[] {
  const counts = [0, 0, 0, 0, 0, 0];
  counts[level - 1] = 1 + (seed % 4);
  if (seed % 3 === 0) {
    const neighbor = level < 6 ? level : level - 2; // 0-indexed neighboring level
    counts[neighbor] = 1 + (seed % 2);
  }
  return counts;
}

function buildMockSrRows(): EscalatedSrRow[] {
  const circles = ['Odissa', 'Punjab', 'Kerala', 'Bihar', 'Delhi', 'Mumbai'];
  const srTypes: SrType[] = ['Parent', 'Child', 'Escalated'];
  const levelBlocks: { level: number; count: number }[] = [1, 2, 3, 4, 5]
    .map(level => ({ level, count: LEVEL_COUNTS[level] }));

  // Round-robin across levels (1,2,3,4,5,1,2,3...) rather than appending each
  // level's whole block in sequence, so the default unfiltered view shows a
  // mix of levels on every page instead of only Level 1 first.
  const rows: EscalatedSrRow[] = [];
  let i = 0;
  const remaining = levelBlocks.map(lc => lc.count);
  while (remaining.some(c => c > 0)) {
    for (let li = 0; li < levelBlocks.length; li++) {
      if (remaining[li] <= 0) { continue; }
      remaining[li]--;
      const { level, count } = levelBlocks[li];
      rows.push({
        // Realistic lengths (matching what the real backend actually
        // returns, confirmed via live VPN testing) rather than the original
        // short placeholders — those were too short to catch the column
        // overlap real data triggered.
        srNumber: '35870455',
        lsi: '80001509258849',
        factory: 'FIBER ON-NET FTTH',
        circle: circles[i % circles.length],
        cluster: 'INDORE',
        customer: 'C-Edge',
        level,
        srType: srTypes[i % srTypes.length],
        srCounts: count,
        escalatedTime: '12/11/2025   11:12',
        levelCounts: buildMockLevelCounts(level, i),
      });
      i++;
    }
  }
  return rows;
}

export function getMockDashboardData(): EscalationDashboardData {
  return {
    levelTiles: buildMockLevelTiles(),
    srRows: buildMockSrRows(),
  };
}
