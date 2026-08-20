import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
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
  // Call Escalation Tracking — one count per level (index 0 = Level 1 ...
  // index 5 = Level 6), always exactly 6 entries. Sourced from the real
  // getEscalationsCallCount API's level1_Count..level6_Count when
  // available (see EscalationMatrixService.toEscalatedSrRow) — that data
  // was already being fetched per-row and summed into srCounts above; this
  // preserves the individual values too instead of discarding them.
  levelCounts: number[];
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

export type SortColumn = 'srNumber' | 'lsi' | 'factory' | 'circle' | 'cluster' | 'customer' | 'level' | 'srType' | 'srCounts' | 'escalatedTime';
type SortDirection = 'asc' | 'desc';

// Which row field each sortable header reads from, and whether it compares
// as a number/date or as text — one place both the header-click sort and
// the (now unified) "Sort by" dropdown pull from, so they can't disagree.
const SORT_ACCESSORS: Record<SortColumn, (row: EscalatedSrRow) => string | number> = {
  srNumber: r => r.srNumber,
  lsi: r => r.lsi,
  factory: r => r.factory,
  circle: r => r.circle,
  cluster: r => r.cluster,
  customer: r => r.customer,
  level: r => r.level,
  srType: r => r.srType,
  srCounts: r => r.srCounts,
  escalatedTime: r => { const t = Date.parse(r.escalatedTime); return isNaN(t) ? 0 : t; },
};

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

  // Row click and toolbar-refresh bubble up to the page: row click navigates
  // to the SR's detail view (a routing concern owned by the parent, not this
  // table), and refresh re-fetches from EscalationMatrixService (also owned
  // by the parent — this component has no service dependency of its own).
  @Output() rowClick = new EventEmitter<EscalatedSrRow>();
  @Output() lsiClick = new EventEmitter<EscalatedSrRow>();
  @Output() refreshClick = new EventEmitter<void>();

  // Level filter (from the active tile) + free-text search — both purely
  // client-side, matching DJP's own dashboard.component.ts (its
  // fetchEscalationsHistory API has no server-side filter/search params to
  // call instead; applyFilter() there does the same substring match across
  // every field, done here too rather than inventing a narrower search).
  get filteredRows(): EscalatedSrRow[] {
    let result = this.levelFilter ? this.rows.filter(r => r.level === this.levelFilter) : this.rows;
    const q = this.tableSearchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(r => [r.srNumber, r.lsi, r.factory, r.circle, r.cluster, r.customer, r.srType, String(r.level)]
        .some(field => field.toLowerCase().includes(q)));
    }
    return result;
  }

  // Sort is a djp-cfm-only convenience layered on top of the same
  // client-side array (DJP's own UI has no sort control — it only ever
  // sorts once, server-response-order, by Created_on desc). Applied after
  // filtering, before pagination. Single source of truth (sortColumn +
  // sortDirection) driven by either the "Sort by" dropdown or clicking a
  // column header directly — see setSort()/onHeaderSort() below.
  sortColumn: SortColumn = 'escalatedTime';
  sortDirection: SortDirection = 'desc';

  get sortedFilteredRows(): EscalatedSrRow[] {
    const rows = [...this.filteredRows];
    const getValue = SORT_ACCESSORS[this.sortColumn];
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return rows.sort((a, b) => {
      const va = getValue(a);
      const vb = getValue(b);
      if (typeof va === 'number' && typeof vb === 'number') { return (va - vb) * dir; }
      return String(va).localeCompare(String(vb)) * dir;
    });
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
  // filteredRows/sortedFilteredRows already react live to tableSearchQuery on
  // every keystroke (it's a plain getter re-evaluated each change-detection
  // pass) — onTableSearch() just resets pagination so a search doesn't strand
  // the user on a now out-of-range page.
  tableSearchQuery = '';
  onTableSearch(): void {
    this.currentPage = 1;
  }

  sortOptions = ['Newest first', 'Oldest first', 'Level: high to low', 'Level: low to high'];
  activeSort = this.sortOptions[0];
  isSortOpen = false;
  toggleSort(): void {
    this.isSortOpen = !this.isSortOpen;
    this.isFilterOpen = false;
  }

  private static readonly DROPDOWN_SORT: Record<string, { column: SortColumn; direction: SortDirection }> = {
    'Newest first': { column: 'escalatedTime', direction: 'desc' },
    'Oldest first': { column: 'escalatedTime', direction: 'asc' },
    'Level: high to low': { column: 'level', direction: 'desc' },
    'Level: low to high': { column: 'level', direction: 'asc' },
  };

  setSort(opt: string): void {
    this.activeSort = opt;
    const mapped = EscalatedSrsComponent.DROPDOWN_SORT[opt];
    if (mapped) {
      this.sortColumn = mapped.column;
      this.sortDirection = mapped.direction;
    }
    this.isSortOpen = false;
    this.currentPage = 1;
  }

  // Clicking a column header sorts by it directly — same underlying state
  // as the "Sort by" dropdown above (whichever was used last wins), so
  // there's no way for the two to disagree. First click on a column starts
  // ascending; clicking the same header again flips direction.
  onHeaderSort(column: SortColumn): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  // Filter panel has no real options yet — placeholder until a spec exists.
  isFilterOpen = false;
  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
    this.isSortOpen = false;
  }

  // Brief spin animation on the refresh icon, plus the real re-fetch (owned
  // by the parent page, emitted via refreshClick) — the spin covers the
  // instant it takes the mock fallback to resolve; a real network response
  // would naturally take longer, and the spin just stops whenever it stops
  // rather than needing to be timed to it.
  isTableRefreshing = false;
  onToolbarRefresh(): void {
    this.isTableRefreshing = true;
    this.currentPage = 1;
    this.refreshClick.emit();
    setTimeout(() => { this.isTableRefreshing = false; }, 700);
  }

  onExpand(): void {
    console.log('Expand escalated SRs table');
  }

  onRowClick(row: EscalatedSrRow): void {
    this.rowClick.emit(row);
  }

  onLsiClick(row: EscalatedSrRow): void {
    this.lsiClick.emit(row);
  }

  onExport(): void {
    const headers = ['SR Number', 'LSI', 'Factory', 'Circle', 'Cluster', 'Customer', 'Level', 'SR Type', 'SR Counts', 'Escalated Time'];
    const lines = [headers.join(',')];
    for (const row of this.sortedFilteredRows) {
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
  // 25/page (was 6) — meets the "at least 20 records per page" requirement
  // with some headroom; totalPages/pagedRows/showingText below are all
  // already derived from this constant, so nothing else needed to change.
  readonly pageSize = 25;
  currentPage = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  get pagedRows(): EscalatedSrRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.sortedFilteredRows.slice(start, start + this.pageSize);
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
}
