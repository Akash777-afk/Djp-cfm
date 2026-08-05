import { Component, HostListener, OnInit } from '@angular/core';
import { EscalationLevelTile } from './components/escalation-levels/escalation-levels.component';
import { EscalatedSrRow, SrType } from './components/escalated-srs/escalated-srs.component';
import { LEVEL_COLORS, LEVEL_COUNTS, levelColorRgba } from './escalation-matrix.constants';

@Component({
  selector: 'app-escalation-matrix',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.scss']
})
export class EscalationMatrixComponent implements OnInit {

  // ---------- Responsive scale-to-fit (same approach as incident-management) ----------
  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  ngOnInit(): void {
    this.updateScale();
  }

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / EscalationMatrixComponent.DESIGN_WIDTH, 1);
  }

  // ---------- Welcome banner (matches Incident Management's page-level pattern) ----------
  userName = 'Akash Ganapathy2';

  onCallClick(): void {
    console.log('Call clicked');
  }
  onBookClick(): void {
    console.log('Book clicked');
  }

  onLevelsRefresh(): void {
    console.log('Refresh escalation levels');
  }

  // Which single level tile is currently "active" (special style + table
  // filter). Defaults to 'all' since the table starts out showing every row.
  activeCardKey = 'all';

  setActiveCard(key: string): void {
    this.activeCardKey = key;
  }

  // null = no filter (show every row), matching the 'all' tile.
  get levelFilter(): number | null {
    if (this.activeCardKey === 'all') { return null; }
    return Number(this.activeCardKey.replace('level-', ''));
  }

  // ---------- Level tiles (left to right order) ----------
  private readonly totalEscalatedCount = Object.values(LEVEL_COUNTS).reduce((sum, count) => sum + count, 0);

  levelTiles: EscalationLevelTile[] = [
    { key: 'all',     label: 'Counts',  value: this.totalEscalatedCount, accent: '#a855f7',      bg: 'rgba(168, 85, 247, 0.06)',   icon: '/assets/escalation-matrix/TotalEM.png',  filledDots: 0, pillText: 'All Escalated SRs' },
    { key: 'level-1', label: 'Level 1', value: LEVEL_COUNTS[1], accent: LEVEL_COLORS[1], bg: levelColorRgba(1, 0.06), icon: '/assets/escalation-matrix/L1-recon.png', filledDots: 1 },
    { key: 'level-2', label: 'Level 2', value: LEVEL_COUNTS[2], accent: LEVEL_COLORS[2], bg: levelColorRgba(2, 0.06), icon: '/assets/escalation-matrix/L2-recon.png', filledDots: 2 },
    { key: 'level-3', label: 'Level 3', value: LEVEL_COUNTS[3], accent: LEVEL_COLORS[3], bg: levelColorRgba(3, 0.06), icon: '/assets/escalation-matrix/L3-recon.png', filledDots: 3 },
    { key: 'level-4', label: 'Level 4', value: LEVEL_COUNTS[4], accent: LEVEL_COLORS[4], bg: levelColorRgba(4, 0.06), icon: '/assets/escalation-matrix/EMLevel4.png', filledDots: 4 },
    { key: 'level-5', label: 'Level 5', value: LEVEL_COUNTS[5], accent: LEVEL_COLORS[5], bg: levelColorRgba(5, 0.06), icon: '/assets/escalation-matrix/EMLevel5.png', filledDots: 5 },
    { key: 'level-6', label: 'Level 6', value: LEVEL_COUNTS[6], accent: LEVEL_COLORS[6], bg: levelColorRgba(6, 0.06), icon: '/assets/escalation-matrix/EMLevel6.png', filledDots: 6 },
  ];

  // ---------- Escalated SR table rows ----------
  // Counts per level mirror the tiles above exactly (LEVEL_COUNTS sums to
  // totalEscalatedCount, matching "Counts"); Level 6 has no rows since its
  // tile is 0.
  srRows: EscalatedSrRow[] = this.buildMockRows();

  private buildMockRows(): EscalatedSrRow[] {
    const circles = ['Odissa', 'Punjab', 'Kerala', 'Bihar', 'Delhi', 'Mumbai'];
    const srTypes: SrType[] = ['Parent', 'Child', 'Escalated'];
    const levelCounts: { level: number; count: number }[] = [1, 2, 3, 4, 5]
      .map(level => ({ level, count: LEVEL_COUNTS[level] }));

    // Round-robin across levels (1,2,3,4,5,1,2,3...) rather than appending
    // each level's whole block in sequence, so the default unfiltered view
    // shows a mix of levels on every page instead of only Level 1 first.
    const rows: EscalatedSrRow[] = [];
    let i = 0;
    let remaining = levelCounts.map(lc => lc.count);
    while (remaining.some(c => c > 0)) {
      for (let li = 0; li < levelCounts.length; li++) {
        if (remaining[li] <= 0) { continue; }
        remaining[li]--;
        const { level, count } = levelCounts[li];
        rows.push({
          srNumber: '35870455',
          lsi: '123456',
          factory: 'RF-P2P',
          circle: circles[i % circles.length],
          cluster: 'INDORE',
          customer: 'C-Edge',
          level,
          srType: srTypes[i % srTypes.length],
          srCounts: count,
          escalatedTime: '12/11/2025   11:12',
        });
        i++;
      }
    }
    return rows;
  }
}
