import { Component, HostListener, OnInit } from '@angular/core';
import { PlannedOutage } from './components/crq-planned-outages/crq-planned-outages.component';
import { DetailTab } from './components/planned-outage-input/planned-outage-input.component';

@Component({
  selector: 'app-change-management',
  templateUrl: './change-management.component.html',
  styleUrls: ['./change-management.component.scss']
})
export class ChangeManagementComponent implements OnInit {

  // ---------- Responsive scale-to-fit (same approach as incident-management) ----------
  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / ChangeManagementComponent.DESIGN_WIDTH, 1);
  }

  lastUpdated = '09.56 am 28.04.2024';

  topbarSearchQuery = '';

  crqSearch = '';
  poIdSearch = '';

  sortBy = 'Sort by...';

  // Table rows - converted from the 3 static repeated rows in the design
  plannedOutages: PlannedOutage[] = [
    {
      outageId: '110039400',
      crq: 'CRQ000005963007',
      changeType: 'Link shifting',
      impact: 'Service affecting',
      status: 'Planned',
      implementer: 'Changemgmt@airtel.com',
      description: 'Topology modification...',
      startDate: '2026.03.18 - 00:00:00',
      endDate: '2026.03.18 - 00:00:00',
      reason: 'N/A',
      submission: 'Submitted'
    },
    {
      outageId: '110039400',
      crq: 'CRQ000005963007',
      changeType: 'Link shifting',
      impact: 'Service affecting',
      status: 'Planned',
      implementer: 'Changemgmt@airtel.com',
      description: 'Topology modification...',
      startDate: '2026.03.18 - 00:00:00',
      endDate: '2026.03.18 - 00:00:00',
      reason: 'N/A',
      submission: 'Submitted'
    },
    {
      outageId: '110039400',
      crq: 'CRQ000005963007',
      changeType: 'Link shifting',
      impact: 'Service affecting',
      status: 'Planned',
      implementer: 'Changemgmt@airtel.com',
      description: 'Topology modification...',
      startDate: '2026.03.18 - 00:00:00',
      endDate: '2026.03.18 - 00:00:00',
      reason: 'N/A',
      submission: 'Submitted'
    }
  ];

  // Detail panel state - populated when a row's "view" export icon is clicked
  selectedOutage: PlannedOutage | null = null;
  activeDetailTab: DetailTab = 'plannedOutage';

  constructor() { }

  ngOnInit(): void {
    this.selectedOutage = this.plannedOutages[0];
    this.updateScale();
  }

  onMenuClick(): void {
    console.log('Menu clicked');
  }

  onTopbarRefresh(): void {
    console.log('Refresh clicked');
  }

  onTopbarSearch(): void {
    console.log('Searching for services:', this.topbarSearchQuery);
  }

  onToolbarRefresh(): void {
    console.log('Refresh table');
  }

  onSearch(): void {
    // TODO: wire up to backend / filter service using this.crqSearch / this.poIdSearch
  }

  onReset(): void {
    this.crqSearch = '';
    this.poIdSearch = '';
  }

  onCreatePo(): void {
    // TODO: open create PO flow
  }

  onExport(): void {
    // TODO: trigger export
  }

  selectOutage(outage: PlannedOutage): void {
    this.selectedOutage = outage;
  }

  setDetailTab(tab: DetailTab): void {
    this.activeDetailTab = tab;
  }

  onAssigneeClick(): void {
    console.log('Assignee clicked');
  }

  onNotifyClick(): void {
    console.log('Notifications clicked');
  }

  onMoreOptionsClick(): void {
    console.log('More options clicked');
  }
}
