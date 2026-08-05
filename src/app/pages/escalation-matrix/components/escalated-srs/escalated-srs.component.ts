import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LEVEL_COLORS } from '../../escalation-matrix.constants';

export type SrType = 'Parent' | 'Child' | 'Escalated';

export interface EscalatedSrRow {
  srNumber: string;
  lsi: string;
  factory: string;
  circle: string;
  cluster: string;
  customer: string;
  level: number;       // 1-6
  srType: SrType;
  srCounts: number;
  escalatedTime: string;
}

interface PaginationPage {
  label: string;
  active: boolean;
  disabled?: boolean; // true for the non-clickable "…" gap marker
}

interface SrTypeStyle {
  color: string;
  bg: string;
  border: string;
}

const SR_TYPE_STYLE: Record<SrType, SrTypeStyle> = {
  Parent:    { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)' },
  Child:     { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' },
  Escalated: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)',  border: 'rgba(239, 68, 68, 0.3)'  },
};

@Component({
  selector: 'app-escalated-srs',
  templateUrl: './escalated-srs.component.html',
  styleUrls: ['./escalated-srs.component.scss']
})
export class EscalatedSrsComponent implements OnChanges {

  @Input() rows: EscalatedSrRow[] = [];
  @Input() levelFilter: number | null = null;

  readonly dotSlots = [0, 1, 2, 3, 4, 5];

  get filteredRows(): EscalatedSrRow[] {
    return this.levelFilter ? this.rows.filter(r => r.level === this.levelFilter) : this.rows;
  }

  // Table title follows whichever level tile is active, same convention as
  // all-nstts' per-status title.
  get tableTitle(): string {
    return this.levelFilter ? `Level ${this.levelFilter} Escalated SRs` : 'Escalated SRs';
  }

  levelColor(level: number): string {
    return LEVEL_COLORS[level] ?? '#94a3b8';
  }

  srTypeStyle(type: SrType): SrTypeStyle {
    return SR_TYPE_STYLE[type];
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whichever level tile is active changed (or the source data did) — start
    // back at page 1 rather than stranding the user on a now-invalid page.
    if (changes['levelFilter'] || changes['rows']) {
      this.currentPage = 1;
    }
  }

  // ---------- Toolbar interactions ----------
  tableSearchQuery = '';
  onTableSearch(): void {
    console.log('Searching escalated SRs for:', this.tableSearchQuery);
  }

  sortOptions = ['Newest first', 'Oldest first', 'Level: high to low', 'Level: low to high'];
  activeSort = this.sortOptions[0];
  isSortOpen = false;
  toggleSort(): void {
    this.isSortOpen = !this.isSortOpen;
    this.isFilterOpen = false;
    this.isSettingsOpen = false;
  }
  setSort(opt: string): void {
    this.activeSort = opt;
    this.isSortOpen = false;
  }

  // Filter panel has no real options yet — placeholder until a spec exists,
  // same pattern as the settings dropdown below.
  isFilterOpen = false;
  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
    this.isSortOpen = false;
    this.isSettingsOpen = false;
  }

  isSettingsOpen = false;
  toggleSettings(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
    this.isSortOpen = false;
    this.isFilterOpen = false;
  }

  // Brief spin animation on the refresh icon to signal the table reloaded —
  // there's no real backend yet, so this just re-runs the paging/filter
  // pipeline from page 1 rather than fetching anything new.
  isTableRefreshing = false;
  onToolbarRefresh(): void {
    this.isTableRefreshing = true;
    this.currentPage = 1;
    setTimeout(() => { this.isTableRefreshing = false; }, 700);
  }

  onExpand(): void {
    console.log('Expand escalated SRs table');
  }

  onRowClick(row: EscalatedSrRow): void {
    console.log('Open SR:', row.srNumber);
  }

  onExport(): void {
    const headers = ['SR Number', 'LSI', 'Factory', 'Circle', 'Cluster', 'Customer', 'Level', 'SR Type', 'SR Counts', 'Escalated Time'];
    const lines = [headers.join(',')];
    for (const row of this.filteredRows) {
      const cells = [row.srNumber, row.lsi, row.factory, row.circle, row.cluster, row.customer, row.level, row.srType, row.srCounts, row.escalatedTime];
      lines.push(cells.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'escalated-srs.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Pagination ----------
  readonly pageSize = 6;
  currentPage = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  get pagedRows(): EscalatedSrRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get showingText(): string {
    const total = this.filteredRows.length;
    if (total === 0) { return 'Showing 0 of 0 entries'; }
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, total);
    return `Showing ${start}–${end} of ${total} entries`;
  }

  // Windowed page list (first, last, and a neighborhood around the current
  // page, with "…" gap markers) — unlike all-nstts this table can hold
  // hundreds of rows, so listing every page number would overflow the row.
  get pages(): PaginationPage[] {
    const result: PaginationPage[] = [{ label: 'Previous', active: false }];
    const total = this.totalPages;
    const current = this.currentPage;
    const neighborhood = 1;

    const pageNumbers = new Set<number>([1, total]);
    for (let p = current - neighborhood; p <= current + neighborhood; p++) {
      if (p >= 1 && p <= total) { pageNumbers.add(p); }
    }
    const sorted = Array.from(pageNumbers).sort((a, b) => a - b);

    let prev: number | null = null;
    for (const p of sorted) {
      if (prev !== null && p - prev > 1) {
        result.push({ label: '…', active: false, disabled: true });
      }
      result.push({ label: String(p), active: p === current });
      prev = p;
    }
    result.push({ label: 'Next', active: false });
    return result;
  }

  setPage(page: PaginationPage): void {
    if (page.disabled) { return; }
    if (page.label === 'Previous') { this.goToPage(this.currentPage - 1); return; }
    if (page.label === 'Next') { this.goToPage(this.currentPage + 1); return; }
    this.goToPage(Number(page.label));
  }

  private goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) { return; }
    this.currentPage = page;
  }

  // Row spacing constant (px between rows in the column-major table)
  readonly ROW_GAP = 71;
}
