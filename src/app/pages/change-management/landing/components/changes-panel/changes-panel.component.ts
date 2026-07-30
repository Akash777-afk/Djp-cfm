import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DashboardChangeRow } from '../../change-management-landing.types';

@Component({
  selector: 'app-cml-changes-panel',
  templateUrl: './changes-panel.component.html',
  styleUrls: ['./changes-panel.component.scss']
})
export class ChangeManagementLandingChangesPanelComponent implements OnChanges {

  @Input() changes: DashboardChangeRow[] = [];
  @Input() statusFilter: string | null = null;
  @Output() changeIdClick = new EventEmitter<string>();

  fromDate = '';
  toDate = '';

  pageSize = 6;
  currentPage = 1;

  // Pagination starts collapsed ("1 2 … 8") and stays expanded once opened.
  pagesExpanded = false;

  // The filter dropdown is a manual override on top of whichever stat card is
  // active. null = untouched (defer to the card); 'all' = explicitly show
  // everything; any other value = an explicit status override.
  filterOptions = ['All', 'Emergency', 'Planned', 'Open'];
  manualFilter: string | null = null;
  isFilterOpen = false;

  ngOnChanges(changes: SimpleChanges): void {
    // Whichever stat card is active changed (or the source data did) — start
    // back at page 1 and re-collapse pagination rather than stranding the
    // user on a now-invalid page, and let the card take priority again.
    if (changes['statusFilter'] || changes['changes']) {
      this.currentPage = 1;
      this.pagesExpanded = false;
      this.manualFilter = null;
    }
  }

  get effectiveFilter(): string | null {
    if (this.manualFilter === null) { return this.statusFilter; }
    return this.manualFilter === 'all' ? null : this.manualFilter;
  }

  get filterLabel(): string {
    if (this.manualFilter === null || this.manualFilter === 'all') { return 'Filter by..'; }
    return this.manualFilter;
  }

  get filteredChanges(): DashboardChangeRow[] {
    const filter = this.effectiveFilter;
    if (!filter) { return this.changes; }
    return this.changes.filter(c => c.status === filter);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredChanges.length / this.pageSize);
  }

  get pagedChanges(): DashboardChangeRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredChanges.slice(start, start + this.pageSize);
  }

  get rangeStart(): number {
    return this.filteredChanges.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredChanges.length);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) { return; }
    this.currentPage = page;
  }

  expandPages(): void {
    this.pagesExpanded = true;
  }

  onSearch(): void {
    // TODO: wire up to backend / filter service using this.fromDate / this.toDate
  }
  onExport(): void {
    console.log('Export clicked');
  }

  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
  }

  selectFilter(option: string): void {
    this.manualFilter = option === 'All' ? 'all' : option;
    this.isFilterOpen = false;
    this.currentPage = 1;
    this.pagesExpanded = false;
  }

  // showPicker() isn't in this project's TS DOM lib version yet, and isn't
  // supported by every browser — guard both and fall back to the input's own
  // native click-to-open behavior otherwise.
  openDatePicker(input: HTMLInputElement): void {
    const el = input as HTMLInputElement & { showPicker?: () => void };
    if (typeof el.showPicker === 'function') {
      el.showPicker();
    }
  }
}
