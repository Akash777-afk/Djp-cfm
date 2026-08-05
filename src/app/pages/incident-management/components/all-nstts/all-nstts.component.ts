import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

export interface NsttRow {
  vipType: 'diamond' | 'account';
  nstt: string;
  nsttAgeing: string;
  site: string;
  status: string;
  actualIncidentTime: string;
  assignedGroup: string;
  lastErtTime: string;
  upTime: string;
}

interface PaginationPage {
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-all-nstts',
  templateUrl: './all-nstts.component.html',
  styleUrls: ['./all-nstts.component.scss']
})
export class AllNsttsComponent implements OnChanges {

  @Input() nsttRows: NsttRow[] = [];
  @Input() statusFilter: string | null = null;

  get filteredRows(): NsttRow[] {
    return this.statusFilter ? this.nsttRows.filter(r => r.status === this.statusFilter) : this.nsttRows;
  }

  // Table title follows whichever stat tile is active up in the parent —
  // phrased per-status rather than a fixed template ("NSTTs in progress"
  // reads better than "In progress NSTTs") so each entry is spelled out.
  private readonly statusToTitle: Record<string, string> = {
    'In progress': 'NSTTs in progress',
    Assigned: 'Assigned NSTTs',
    Escalated: 'Escalated NSTTs',
    Resolved: 'Resolved NSTTs',
    Closed: 'Closed NSTTs',
    Cancelled: 'Cancelled NSTTs',
    Unknown: 'Unknown NSTTs',
  };
  get tableTitle(): string {
    if (!this.statusFilter) { return 'All NSTTs'; }
    return this.statusToTitle[this.statusFilter] ?? 'All NSTTs';
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whichever stat tile is active changed (or the source data did) — start
    // back at page 1 rather than stranding the user on a now-invalid page.
    if (changes['statusFilter'] || changes['nsttRows']) {
      this.currentPage = 1;
    }
  }

  // ---------- Toolbar interactions ----------
  tableSearchQuery = '';
  onTableSearch(): void {
    console.log('Searching NSTTs for:', this.tableSearchQuery);
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

  // Settings panel has no real options yet — placeholder until a layout is
  // provided, same pattern as the other toolbar dropdowns.
  isSettingsOpen = false;
  onToolbarSettings(): void {
    this.isSettingsOpen = !this.isSettingsOpen;
    this.isBinOpen = false;
    this.isFilterOpen = false;
    this.isOwnerOpen = false;
  }

  isBinOpen = false;
  toggleBin(): void {
    this.isBinOpen = !this.isBinOpen;
    this.isFilterOpen = false;
    this.isOwnerOpen = false;
    this.isSettingsOpen = false;
  }

  binOptions = [
    { label: 'ES_IM ENGINEER', checked: true },
    { label: 'OUTAGE_RF', checked: true },
    { label: 'OUTAGE_IM', checked: true },
  ];
  toggleBinOption(opt: { checked: boolean }): void {
    opt.checked = !opt.checked;
  }

  isFilterOpen = false;
  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
    this.isBinOpen = false;
    this.isOwnerOpen = false;
    this.isSettingsOpen = false;
  }

  groupSearchQuery = '';
  groupOptions = [
    { label: 'NOC_NS', checked: false },
    { label: 'CEN_Network', checked: false },
    { label: 'NOC_S&D', checked: false },
    { label: 'NOC_NS_ANG', checked: false },
    { label: 'NSG-ITMC', checked: false },
  ];
  get filteredGroupOptions() {
    const q = this.groupSearchQuery.trim().toLowerCase();
    return q ? this.groupOptions.filter(o => o.label.toLowerCase().includes(q)) : this.groupOptions;
  }
  toggleGroupOption(opt: { checked: boolean }): void {
    opt.checked = !opt.checked;
  }

  isOwnerOpen = false;
  toggleOwner(): void {
    this.isOwnerOpen = !this.isOwnerOpen;
    this.isBinOpen = false;
    this.isFilterOpen = false;
    this.isSettingsOpen = false;
  }

  ownerSearchQuery = '';
  ownerOptions = [
    { label: 'Annu Sharma', id: 'A1NYLWE8', checked: false },
    { label: 'Tanmay Kasaudhan', id: 'A19MCFF0', checked: false },
    { label: 'Shivam Kumar', id: 'A1I6HZS0', checked: false },
    { label: 'Suraj Yadav', id: 'A1SPB4XK', checked: false },
    { label: '. Pandey Anupam', id: 'A1DUP8OJ', checked: false },
    { label: 'Pallavi Kumari', id: 'A1NQEDSG', checked: false },
  ];
  get filteredOwnerOptions() {
    const q = this.ownerSearchQuery.trim().toLowerCase();
    return q ? this.ownerOptions.filter(o => o.label.toLowerCase().includes(q)) : this.ownerOptions;
  }
  toggleOwnerOption(opt: { checked: boolean }): void {
    opt.checked = !opt.checked;
  }

  // false = normal "All NSTTs" table (default). true = the reduced
  // "SR without NSTT" view — same switch, just re-purposed to show the
  // stripped-down single-column table instead of a separate page.
  toggleOn = false;
  onToggleClick(): void {
    this.toggleOn = !this.toggleOn;
  }

  // Mock total for the "SR without NSTT" reduced view — there's no real
  // data source for this yet, only the single count shown in the design.
  srWithoutNsttCount = 9;

  onRowRefresh(row: NsttRow): void {
    console.log('Refresh row:', row.nstt);
  }

  onExport(): void {
    const headers = ['VIP Flag', 'NSTT', 'NSTT Ageing', 'Site', 'Status', 'Actual Incident Time', 'Assigned Group', 'Last ERT Time', 'Up Time'];
    const lines = [headers.join(',')];
    for (const row of this.filteredRows) {
      const cells = [row.vipType, row.nstt, row.nsttAgeing, row.site, row.status, row.actualIncidentTime, row.assignedGroup, row.lastErtTime, row.upTime];
      lines.push(cells.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'all-nstts.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  // ---------- Pagination ----------
  readonly pageSize = 6;
  currentPage = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  get pagedRows(): NsttRow[] {
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

  get pages(): PaginationPage[] {
    const result: PaginationPage[] = [{ label: 'Previous', active: false }];
    for (let p = 1; p <= this.totalPages; p++) {
      result.push({ label: String(p), active: p === this.currentPage });
    }
    result.push({ label: 'Next', active: false });
    return result;
  }

  setPage(page: PaginationPage): void {
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
