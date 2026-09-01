import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ChangeManagementService } from '../../services/change-management.service';

interface ImpactedLsiRow {
  lsi: string;
  serviceType: string;
  customer: string;
}

@Component({
  selector: 'app-cm-service-impact-modal',
  templateUrl: './service-impact-modal.component.html',
  styleUrls: ['./service-impact-modal.component.scss']
})
export class ServiceImpactModalComponent implements OnChanges {

  constructor(private cmService: ChangeManagementService) {}

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  readonly domainOptions = ['All Domains', 'Enterprise', 'Wholesale', 'Retail', 'Government'];
  readonly pageSizeOptions = [7, 10, 20, 50, 100];

  domain = 'All Domains';
  nodeQuery = '';
  lsiFilter = '';

  hasSearched = false;
  isSearching = false;

  pageSize = 7;
  currentPage = 1;

  allRows: ImpactedLsiRow[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetState();
    }
  }

  get filteredRows(): ImpactedLsiRow[] {
    const q = this.lsiFilter.trim().toLowerCase();
    return q ? this.allRows.filter(r => r.lsi.toLowerCase().includes(q)) : this.allRows;
  }

  get totalRows(): number {
    return this.filteredRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRows / this.pageSize));
  }

  get pagedRows(): ImpactedLsiRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get rangeStart(): number {
    return this.totalRows === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRows);
  }

  // Real search (API #5) — domain + node are the real query params DJP
  // sends; lsiFilter is a client-side-only refinement on top of the results
  // (DJP has no separate LSI-filter API param).
  search(): void {
    this.isSearching = true;
    this.currentPage = 1;
    this.cmService.getServiceImpactedLsis(this.domain, this.nodeQuery).subscribe(rows => {
      this.isSearching = false;
      this.hasSearched = true;
      this.allRows = (rows || []).map(r => ({ lsi: r.LSI, serviceType: r.ServiceType, customer: r.Customer }));
    });
  }

  reset(): void {
    this.domain = 'All Domains';
    this.nodeQuery = '';
    this.lsiFilter = '';
    this.hasSearched = false;
    this.allRows = [];
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) { return; }
    this.currentPage = page;
  }

  onExport(): void {
    console.log('Export impacted LSI clicked');
    // TODO: trigger export once a backend endpoint exists
  }

  close(): void {
    this.closed.emit();
  }

  private resetState(): void {
    this.domain = 'All Domains';
    this.nodeQuery = '';
    this.lsiFilter = '';
    this.hasSearched = false;
    this.allRows = [];
    this.pageSize = 7;
    this.currentPage = 1;
  }
}
