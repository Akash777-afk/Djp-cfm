import { Component } from '@angular/core';
import { ASSET } from '../../noc-portal.constants';

export type SrType = 'Parent' | 'Child';
export type AlertSeverity = 'critical' | 'warning';

export interface AllSrRow {
  srNumber: string;
  riseDate: string;
  summary: string;
  lastMileId: string;
  lastMileIp: string;
  srSubType: string;
  srType: SrType;
  level: number; // 1-6, same scale as Escalation Matrix
  escalatedTime: string;
  alert: AlertSeverity;
}

interface SrTypeStyle {
  color: string;
  bg: string;
  border: string;
}

interface PaginationPage {
  label: string;
  active: boolean;
  disabled?: boolean;
}

interface HistoryTab {
  key: string;
  label: string;
  active: boolean;
}

// Same accent-per-level scale as Escalation Matrix (escalation-matrix.constants.ts
// LEVEL_COLORS) — duplicated rather than cross-imported so this page's table
// can't drift if that one changes, same "clone, don't share" approach used
// for the rest of NOC Portal (sidebar, header).
const LEVEL_COLORS: Record<number, string> = {
  1: '#078811',
  2: '#5cb811',
  3: '#ffb74d',
  4: '#ff8725',
  5: '#ff4124',
  6: '#d1150b',
};

// Same Parent/Child badge colors as Escalation Matrix's SR Type column
// (Escalation Matrix also has an 'Escalated' variant this table doesn't use).
const SR_TYPE_STYLE: Record<SrType, SrTypeStyle> = {
  Parent: { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)' },
  Child:  { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' },
};

const ALERT_ICON: Record<AlertSeverity, string> = {
  critical: `${ASSET}/alert.svg`,
  warning: `${ASSET}/alert2.svg`,
};

// Mock rows — same convention as Escalation Matrix's mock data (swap for a
// real API response once backend integration lands). Varied so pagination
// across pages has something to actually show.
const ALL_SR_ROWS: AllSrRow[] = [
  { srNumber: '35870455', riseDate: '07/20/2024', summary: 'Link down',     lastMileId: '12345', lastMileIp: '1.1.221.24', srSubType: 'Primary', srType: 'Parent', level: 2, escalatedTime: '12/11/2025 11:12', alert: 'critical' },
  { srNumber: '35870461', riseDate: '07/20/2024', summary: 'Link Flapping', lastMileId: '12342', lastMileIp: '1.1.221.24', srSubType: 'Primary', srType: 'Child',  level: 3, escalatedTime: '12/11/2025 11:12', alert: 'warning'  },
  { srNumber: '35870478', riseDate: '07/21/2024', summary: 'Link Flapping', lastMileId: '12342', lastMileIp: '1.1.221.25', srSubType: 'Primary', srType: 'Parent', level: 4, escalatedTime: '12/11/2025 11:12', alert: 'critical' },
  { srNumber: '35870482', riseDate: '07/21/2024', summary: 'Link down',     lastMileId: '12345', lastMileIp: '1.1.221.26', srSubType: 'Primary', srType: 'Parent', level: 5, escalatedTime: '12/11/2025 11:12', alert: 'critical' },
  { srNumber: '35870499', riseDate: '07/22/2024', summary: 'Link down',     lastMileId: '12351', lastMileIp: '1.1.221.27', srSubType: 'Primary', srType: 'Child',  level: 1, escalatedTime: '12/11/2025 11:35', alert: 'warning'  },
  { srNumber: '35870503', riseDate: '07/22/2024', summary: 'Link Flapping', lastMileId: '12360', lastMileIp: '1.1.221.28', srSubType: 'Primary', srType: 'Parent', level: 3, escalatedTime: '12/11/2025 11:35', alert: 'critical' },
  { srNumber: '35870517', riseDate: '07/23/2024', summary: 'Link down',     lastMileId: '12377', lastMileIp: '1.1.221.29', srSubType: 'Primary', srType: 'Parent', level: 6, escalatedTime: '12/11/2025 12:03', alert: 'critical' },
  { srNumber: '35870524', riseDate: '07/23/2024', summary: 'Link Flapping', lastMileId: '12384', lastMileIp: '1.1.221.30', srSubType: 'Primary', srType: 'Child',  level: 2, escalatedTime: '12/11/2025 12:03', alert: 'warning'  },
  { srNumber: '35870538', riseDate: '07/24/2024', summary: 'Link down',     lastMileId: '12391', lastMileIp: '1.1.221.31', srSubType: 'Primary', srType: 'Parent', level: 4, escalatedTime: '12/11/2025 12:20', alert: 'critical' },
  { srNumber: '35870545', riseDate: '07/24/2024', summary: 'Link Flapping', lastMileId: '12398', lastMileIp: '1.1.221.32', srSubType: 'Primary', srType: 'Parent', level: 5, escalatedTime: '12/11/2025 12:20', alert: 'critical' },
];

@Component({
  selector: 'app-noc-all-srs',
  templateUrl: './all-srs.component.html',
  styleUrls: ['./all-srs.component.scss']
})
export class NocAllSrsComponent {
  readonly headingIcon = `${ASSET}/hicon.svg`;
  readonly eyeIcon = `${ASSET}/eye.svg`;
  readonly docIcon = `${ASSET}/docu.svg`;

  // Same toolbar icon set as Escalation Matrix's escalated-srs table (moved
  // to assets/shared/ now that a 2nd page uses them — see assets/README.md).
  readonly downloadIcon = '/assets/shared/Download.png';
  readonly refreshIcon = '/assets/shared/Refresh.png';
  readonly settingsIcon = '/assets/shared/Settings.png';
  readonly filterIcon = '/assets/shared/Filter.png';
  readonly expandIcon = '/assets/shared/Expansion.png';

  readonly dotSlots = [0, 1, 2, 3, 4, 5];

  rows: AllSrRow[] = ALL_SR_ROWS;

  levelColor(level: number): string {
    return LEVEL_COLORS[level] ?? '#94a3b8';
  }
  srTypeStyle(type: SrType): SrTypeStyle {
    return SR_TYPE_STYLE[type];
  }
  alertIcon(severity: AlertSeverity): string {
    return ALERT_ICON[severity];
  }

  // ---------- Toolbar: history tabs (static placeholders, no real view
  // switching yet — see the click handler below) ----------
  historyTabs: HistoryTab[] = [
    { key: 'customer',   label: 'Customer SR History',   active: true },
    { key: 'automation', label: 'Automation SR History', active: false },
    { key: 'pm',         label: 'PM Analysis',           active: false },
  ];
  setHistoryTab(tab: HistoryTab): void {
    this.historyTabs.forEach(t => (t.active = false));
    tab.active = true;
    console.log('All SRs history tab:', tab.key);
  }

  onCreateSr(): void {
    console.log('Create SR clicked');
  }

  // ---------- Toolbar: search / sort / icon actions (same pattern as
  // Escalation Matrix's escalated-srs toolbar) ----------
  searchQuery = '';
  onSearch(): void {
    console.log('Searching all SRs for:', this.searchQuery);
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

  isRefreshing = false;
  onRefresh(): void {
    this.isRefreshing = true;
    this.currentPage = 1;
    setTimeout(() => { this.isRefreshing = false; }, 700);
  }

  onExpand(): void {
    console.log('Expand all SRs table');
  }

  onExport(): void {
    const headers = ['SR Number', 'SR Rise Date', 'SR Summary', 'Last Mile ID', 'Last Mile Device IP', 'SR Sub Type', 'SR Type', 'Escalation Level', 'Escalated Time', 'Alert'];
    const lines = [headers.join(',')];
    for (const row of this.rows) {
      const cells = [row.srNumber, row.riseDate, row.summary, row.lastMileId, row.lastMileIp, row.srSubType, row.srType, row.level, row.escalatedTime, row.alert];
      lines.push(cells.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'all-srs.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  onRowClick(row: AllSrRow): void {
    console.log('Open SR:', row.srNumber);
  }
  onRcaClick(row: AllSrRow): void {
    console.log('View RCA:', row.srNumber);
  }
  onSummarizationClick(row: AllSrRow): void {
    console.log('View summarization:', row.srNumber);
  }
  onActionsClick(row: AllSrRow): void {
    console.log('Row actions:', row.srNumber);
  }

  // ---------- Pagination (same mechanics as Escalation Matrix's table) ----------
  readonly pageSize = 6;
  currentPage = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.rows.length / this.pageSize));
  }
  get pagedRows(): AllSrRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.rows.slice(start, start + this.pageSize);
  }
  get showingText(): string {
    const total = this.rows.length;
    if (total === 0) { return 'Showing 0 of 0 entries'; }
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, total);
    return `Showing ${start}-${end} of ${total} entries`;
  }
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
