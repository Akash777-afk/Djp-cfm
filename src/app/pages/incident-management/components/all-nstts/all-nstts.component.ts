import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  ALL_NSTT_COLUMNS, DEFAULT_SELECTED_COLUMNS, NsttColumnField, TABLE_RENDERABLE_COLUMNS,
} from '../../incident-management.constants';

export interface NsttChildSr {
  srNumber: string;
  lsiNumber: string;
  owner: string;
  sla: string;
  outcome: string;
}

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
  // Added for real API integration — DJP's NSTT rows are always a group of
  // child SRs (SR count + "SR details for each NSTT"), not a flat entity;
  // srCount/srDetails/nsttOwner carry that grouping through to the table.
  srCount: number;
  srDetails: NsttChildSr[];
  nsttOwner: string;
  // Unique LSI count from the dependent getLSIByNSTT call (API #2) — shown
  // in the expand drawer rather than as a new table column, to avoid
  // changing the existing fixed-pixel table layout.
  uniqueLsiCount: number;
}

interface PaginationPage {
  label: string;
  active: boolean;
}

// Which NsttRow field each renderable optional column reads from — the
// generalized version of the old 6 hardcoded {{ row.x }} template bindings.
const OPTIONAL_VALUE_ACCESSORS: Record<string, (row: NsttRow) => string> = {
  Site: r => r.site,
  Status: r => r.status,
  'Actual Incident Time': r => r.actualIncidentTime,
  'Assigned Group': r => r.assignedGroup,
  'Last ERT Time': r => r.lastErtTime,
  'Up Time': r => r.upTime,
};

@Component({
  selector: 'app-all-nstts',
  templateUrl: './all-nstts.component.html',
  styleUrls: ['./all-nstts.component.scss']
})
export class AllNsttsComponent implements OnChanges {

  @Input() nsttRows: NsttRow[] = [];
  @Input() statusFilter: string | null = null;
  // Real "assigned group" values from the NSTT list response — replaces the
  // old hardcoded groupOptions mock list.
  @Input() groupOptionsSource: string[] = [];
  // Ordered list of currently-selected column keys (full 34-field universe,
  // not just the 6 renderable ones) — owned by the parent, which is also
  // what feeds the Custom Settings modal. This component only cares about
  // the subset that intersects TABLE_RENDERABLE_COLUMNS, via
  // visibleOptionalColumns below.
  @Input() selectedColumnOrder: string[] = DEFAULT_SELECTED_COLUMNS.slice();

  // Bin selection changes which NSTTs the parent fetches — a real re-fetch,
  // not a client-side filter, so it's an output rather than local state.
  @Output() binChange = new EventEmitter<string[]>();
  // Settings icon click bubbles up to the parent, which owns the Custom
  // Settings modal (placed outside the scaled canvas wrapper, same
  // position:fixed-containment reason as nstt-sr-drawer) and
  // IncidentManagementService — this component has no service dependency
  // of its own, same convention as EscalatedSrsComponent in Escalation Matrix.
  @Output() openColumnSettings = new EventEmitter<void>();
  @Output() expandRow = new EventEmitter<NsttRow>();

  get filteredRows(): NsttRow[] {
    let result = this.statusFilter ? this.nsttRows.filter(r => r.status === this.statusFilter) : this.nsttRows;

    const checkedGroups = this.groupOptions.filter(o => o.checked).map(o => o.label);
    if (checkedGroups.length > 0) {
      result = result.filter(r => checkedGroups.includes(r.assignedGroup));
    }
    const checkedOwners = this.ownerOptions.filter(o => o.checked).map(o => o.label);
    if (checkedOwners.length > 0) {
      result = result.filter(r => checkedOwners.includes(r.nsttOwner));
    }

    const q = this.tableSearchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(r => [r.nstt, r.site, r.status, r.assignedGroup, r.nsttOwner]
        .some(field => field.toLowerCase().includes(q)));
    }
    return result;
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

  // The reorderable optional-column set — selectedColumnOrder filtered down
  // to the keys this table can actually render (see TABLE_RENDERABLE_COLUMNS'
  // doc comment), in the user's chosen order. No per-column pixel geometry
  // needed anymore — table-layout:auto (see .all-nstts-table) sizes each
  // column to its own widest current value natively, so reordering only
  // changes position, same as before, without hand-tuned widths to carry.
  get visibleOptionalColumns(): NsttColumnField[] {
    return this.selectedColumnOrder
      .filter(key => TABLE_RENDERABLE_COLUMNS.has(key))
      .map(key => ({
        key,
        label: ALL_NSTT_COLUMNS.find(c => c.key === key)?.label ?? key,
      }));
  }
  getOptionalValue(row: NsttRow, key: string): string {
    return OPTIONAL_VALUE_ACCESSORS[key]?.(row) ?? '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whichever stat tile is active changed (or the source data did) — start
    // back at page 1 rather than stranding the user on a now-invalid page.
    if (changes['statusFilter'] || changes['nsttRows']) {
      this.currentPage = 1;
    }
    if (changes['groupOptionsSource']) {
      const checkedBefore = new Set(this.groupOptions.filter(o => o.checked).map(o => o.label));
      this.groupOptions = this.groupOptionsSource.map(label => ({ label, checked: checkedBefore.has(label) }));
    }
    if (changes['nsttRows']) {
      const checkedBefore = new Set(this.ownerOptions.filter(o => o.checked).map(o => o.label));
      const owners = Array.from(new Set(this.nsttRows.map(r => r.nsttOwner).filter(o => o && o !== 'Update')));
      this.ownerOptions = owners.map(label => ({ label, checked: checkedBefore.has(label) }));
    }
  }

  // ---------- Toolbar interactions ----------
  // filteredRows already reacts live to tableSearchQuery on every keystroke
  // (it's a plain getter re-evaluated each change-detection pass) —
  // onTableSearch() just resets pagination.
  tableSearchQuery = '';
  onTableSearch(): void {
    this.currentPage = 1;
  }

  // Brief spin animation on the refresh icon, plus the real re-fetch (parent
  // owns the service call, same as EscalationMatrix's escalated-srs table).
  isTableRefreshing = false;
  onToolbarRefresh(): void {
    this.isTableRefreshing = true;
    this.currentPage = 1;
    this.binChange.emit(this.checkedBinLabels());
    setTimeout(() => { this.isTableRefreshing = false; }, 700);
  }

  // ---------- Settings (Custom Settings modal, column preferences API #5) ----------
  // The modal itself lives in the parent (see class comment on
  // openColumnSettings above) — this just bubbles the click up.
  onToolbarSettings(): void {
    this.openColumnSettings.emit();
    this.isBinOpen = false;
    this.isFilterOpen = false;
    this.isOwnerOpen = false;
  }

  isBinOpen = false;
  toggleBin(): void {
    this.isBinOpen = !this.isBinOpen;
    this.isFilterOpen = false;
    this.isOwnerOpen = false;
  }

  binOptions = [
    { label: 'ES_IM ENGINEER', checked: true },
    { label: 'OUTAGE_RF', checked: true },
    { label: 'OUTAGE_IM', checked: true },
  ];
  private checkedBinLabels(): string[] {
    return this.binOptions.filter(o => o.checked).map(o => o.label);
  }
  toggleBinOption(opt: { checked: boolean }): void {
    opt.checked = !opt.checked;
    // Real re-fetch — the bin selection is a query parameter of API #1, not
    // a client-side filter over already-loaded rows.
    this.binChange.emit(this.checkedBinLabels());
  }

  isFilterOpen = false;
  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
    this.isBinOpen = false;
    this.isOwnerOpen = false;
  }

  groupSearchQuery = '';
  // Populated from groupOptionsSource (real "assigned group" list from the
  // API) in ngOnChanges — starts empty until the first load resolves.
  groupOptions: { label: string; checked: boolean }[] = [];
  get filteredGroupOptions() {
    const q = this.groupSearchQuery.trim().toLowerCase();
    return q ? this.groupOptions.filter(o => o.label.toLowerCase().includes(q)) : this.groupOptions;
  }
  toggleGroupOption(opt: { checked: boolean }): void {
    opt.checked = !opt.checked;
    this.currentPage = 1;
  }

  isOwnerOpen = false;
  toggleOwner(): void {
    this.isOwnerOpen = !this.isOwnerOpen;
    this.isBinOpen = false;
    this.isFilterOpen = false;
  }

  ownerSearchQuery = '';
  // Derived from nsttRows' own computed nsttOwner field (single-owner NSTTs
  // only — "Update" is a prompt state, not a real owner, so it's excluded)
  // in ngOnChanges, replacing the old hardcoded name/id mock list.
  ownerOptions: { label: string; checked: boolean }[] = [];
  get filteredOwnerOptions() {
    const q = this.ownerSearchQuery.trim().toLowerCase();
    return q ? this.ownerOptions.filter(o => o.label.toLowerCase().includes(q)) : this.ownerOptions;
  }
  toggleOwnerOption(opt: { checked: boolean }): void {
    opt.checked = !opt.checked;
    this.currentPage = 1;
  }

  // false = normal "All NSTTs" table (default). true = the reduced
  // "SR without NSTT" view — same switch, just re-purposed to show the
  // stripped-down single-column table instead of a separate page.
  toggleOn = false;
  onToggleClick(): void {
    this.toggleOn = !this.toggleOn;
  }

  // Still mock — "SR without NSTT" is its own bucket in the real API
  // response, not covered by this pass's in-scope APIs (#1/#2/#4/#5 only).
  srWithoutNsttCount = 9;

  // NSTT cell click → expand-to-child-SRs drawer. DJP itself navigates to a
  // whole separate page for this; the drawer shows the same
  // "SR details for each NSTT" data DJP's own page would, just as an
  // overlay instead of a route change — see NsttSrDrawerComponent.
  onRowExpand(row: NsttRow): void {
    this.expandRow.emit(row);
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
}
