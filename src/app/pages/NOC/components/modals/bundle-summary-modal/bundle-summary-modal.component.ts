import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface BundleSummaryRow {
  lsi: string;
  productName: string;
  commonLsi: string;
  location: string;
  bw: string;
  customerSegment: string;
  platform: string;
}

@Component({
  selector: 'app-noc-bundle-summary-modal',
  templateUrl: './bundle-summary-modal.component.html',
  styleUrls: ['./bundle-summary-modal.component.scss']
})
export class BundleSummaryModalComponent {

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  isRefreshing = false;

  // Mock data matching the reference — this modal has no backend behind it,
  // same convention as the rest of NOC Portal / Change Management.
  readonly rows: BundleSummaryRow[] = [
    { lsi: '35870455', productName: 'SDWAN', commonLsi: '–', location: 'Store', bw: '0 Mbps', customerSegment: 'AB', platform: 'Hardware' },
    { lsi: '35870455', productName: 'SDWAN', commonLsi: '–', location: 'Store', bw: '0 Mbps', customerSegment: 'AB', platform: 'Hardware' },
  ];

  close(): void {
    this.closed.emit();
  }

  onRefresh(): void {
    this.isRefreshing = true;
    setTimeout(() => { this.isRefreshing = false; }, 700);
  }

  onViewDetails(row: BundleSummaryRow): void {
    console.log('Bundle Summary: view details', row);
  }
}
