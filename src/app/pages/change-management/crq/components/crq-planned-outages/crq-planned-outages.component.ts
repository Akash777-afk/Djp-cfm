import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlannedOutage } from '../../../shared/types';

@Component({
  selector: 'app-crq-planned-outages',
  templateUrl: './crq-planned-outages.component.html',
  styleUrls: ['./crq-planned-outages.component.scss']
})
export class CrqPlannedOutagesComponent {

  @Input() plannedOutages: PlannedOutage[] = [];

  @Input() sortBy = 'Sort by...';
  @Output() sortByChange = new EventEmitter<string>();

  readonly sortOptions = ['Newest first', 'Oldest first', 'Status', 'CRQ', 'Outage ID'];
  isSortOpen = false;

  toggleSort(): void {
    this.isSortOpen = !this.isSortOpen;
  }

  selectSort(option: string): void {
    this.sortByChange.emit(option);
    this.applySort(option);
    this.isSortOpen = false;
  }

  private applySort(option: string): void {
    switch (option) {
      case 'Newest first':
        this.plannedOutages.sort((a, b) => b.startDate.localeCompare(a.startDate));
        break;
      case 'Oldest first':
        this.plannedOutages.sort((a, b) => a.startDate.localeCompare(b.startDate));
        break;
      case 'Status':
        this.plannedOutages.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'CRQ':
        this.plannedOutages.sort((a, b) => a.crq.localeCompare(b.crq));
        break;
      case 'Outage ID':
        this.plannedOutages.sort((a, b) => a.outageId.localeCompare(b.outageId));
        break;
    }
  }

  @Input() crqSearch = '';
  @Output() crqSearchChange = new EventEmitter<string>();

  @Input() poIdSearch = '';
  @Output() poIdSearchChange = new EventEmitter<string>();

  @Output() search = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  @Output() createPo = new EventEmitter<void>();
  @Output() exportClick = new EventEmitter<void>();
  @Output() refreshClick = new EventEmitter<void>();
  @Output() selectOutage = new EventEmitter<PlannedOutage>();
}
