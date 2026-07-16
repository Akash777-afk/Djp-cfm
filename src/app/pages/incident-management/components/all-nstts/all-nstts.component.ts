import { Component, Input } from '@angular/core';

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
export class AllNsttsComponent {

  @Input() nsttRows: NsttRow[] = [];

  // ---------- Toolbar interactions ----------
  tableSearchQuery = '';
  onTableSearch(): void {
    console.log('Searching NSTTs for:', this.tableSearchQuery);
  }

  onToolbarRefresh(): void {
    console.log('Refresh table');
  }

  onToolbarSettings(): void {
    console.log('Table settings clicked');
  }

  isFilterOpen = false;
  toggleFilter(): void {
    this.isFilterOpen = !this.isFilterOpen;
    this.isOwnerOpen = false;
  }

  isOwnerOpen = false;
  toggleOwner(): void {
    this.isOwnerOpen = !this.isOwnerOpen;
    this.isFilterOpen = false;
  }

  toggleOn = true;
  onToggleClick(): void {
    this.toggleOn = !this.toggleOn;
  }

  onRowRefresh(row: NsttRow): void {
    console.log('Refresh row:', row.nstt);
  }

  // ---------- Pagination ----------
  showingText = 'Showing 1–6 of 10 entries';
  pages: PaginationPage[] = [
    { label: 'Previous', active: false },
    { label: '1',        active: true  },
    { label: '2',        active: false },
    { label: '3',        active: false },
    { label: 'Next',     active: false },
  ];

  setPage(page: PaginationPage): void {
    if (page.label === 'Previous' || page.label === 'Next') return;
    this.pages.forEach(p => (p.active = false));
    page.active = true;
  }

  // Row spacing constant (px between rows in the column-major table)
  readonly ROW_GAP = 71;
}
