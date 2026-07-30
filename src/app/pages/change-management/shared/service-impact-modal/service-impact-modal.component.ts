import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

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

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  readonly domainOptions = ['All Domains', 'Enterprise', 'Wholesale', 'Retail', 'Government'];
  readonly pageSizeOptions = [7, 10, 20, 50, 100];

  domain = 'All Domains';
  nodeQuery = '';
  lsiFilter = '';

  // Domain/Node/Filter LSI are decorative here (no real backend to filter
  // against) — Search just reveals the mock results panel, matching how
  // several other search bars in this app are still non-functional stubs.
  hasSearched = false;

  pageSize = 7;
  currentPage = 1;

  readonly allRows: ImpactedLsiRow[] = this.buildMockRows();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.resetState();
    }
  }

  get totalRows(): number {
    return this.allRows.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRows / this.pageSize));
  }

  get pagedRows(): ImpactedLsiRow[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.allRows.slice(start, start + this.pageSize);
  }

  get rangeStart(): number {
    return this.totalRows === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRows);
  }

  search(): void {
    this.hasSearched = true;
    this.currentPage = 1;
  }

  reset(): void {
    this.domain = 'All Domains';
    this.nodeQuery = '';
    this.hasSearched = false;
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
    this.pageSize = 7;
    this.currentPage = 1;
  }

  private buildMockRows(): ImpactedLsiRow[] {
    const serviceTypes = ['MPLS L3 VPN', 'Internet Leased Line', 'MPLS L2 VPN', 'SD-WAN Managed'];
    const customers = [
      'Reliance Industries Ltd', 'Tata Consultancy Services', 'Infosys Limited',
      'HDFC Bank Ltd', 'Wipro Technologies', 'ICICI Bank Ltd',
      'Larsen & Toubro', 'State Bank of India', 'Mahindra Group', 'Bharti Enterprises',
    ];
    const rows: ImpactedLsiRow[] = [];
    const count = 84;
    for (let i = 0; i < count; i++) {
      rows.push({
        lsi: `LSI-${(4821 + i).toString().padStart(6, '0')}`,
        serviceType: serviceTypes[i % serviceTypes.length],
        customer: customers[i % customers.length],
      });
    }
    return rows;
  }
}
