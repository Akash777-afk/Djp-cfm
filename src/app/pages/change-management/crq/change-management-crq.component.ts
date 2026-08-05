import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlannedOutage } from '../shared/types';
import { DetailTab } from './components/planned-outage-input/planned-outage-input.component';
import { CM_SIDEBAR_ITEMS, SidebarNavItem } from '../shared/sidebar-nav/sidebar-nav.component';

@Component({
  selector: 'app-change-management-crq',
  templateUrl: './change-management-crq.component.html',
  styleUrls: ['./change-management-crq.component.scss']
})
export class ChangeManagementCrqComponent implements OnInit {

  // ---------- Responsive scale-to-fit (same approach as incident-management) ----------
  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / ChangeManagementCrqComponent.DESIGN_WIDTH, 1);
  }

  crqSearch = '';
  poIdSearch = '';

  sortBy = 'Sort by...';

  // Table rows - converted from the static repeated row in the design
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
    }
  ];

  // Detail panel state - populated when a row's "view" export icon is clicked
  selectedOutage: PlannedOutage | null = null;
  activeDetailTab: DetailTab = 'plannedOutage';

  isCreatePoModalOpen = false;
  isServiceImpactModalOpen = false;
  isContactCentreModalOpen = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.selectedOutage = this.plannedOutages[0];
    this.updateScale();
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
    this.isCreatePoModalOpen = true;
  }

  onCreatePoModalClosed(): void {
    this.isCreatePoModalOpen = false;
  }

  onPoCreated(outage: PlannedOutage): void {
    this.plannedOutages = [outage, ...this.plannedOutages];
  }

  onServiceImpactClick(): void {
    this.isServiceImpactModalOpen = true;
  }

  onServiceImpactModalClosed(): void {
    this.isServiceImpactModalOpen = false;
  }

  onContactCentreClick(): void {
    this.isContactCentreModalOpen = true;
  }

  onContactCentreModalClosed(): void {
    this.isContactCentreModalOpen = false;
  }

  sidebarItems: SidebarNavItem[] = CM_SIDEBAR_ITEMS;

  onSidebarItemClick(key: string): void {
    switch (key) {
      case 'lsi-search':      this.onLsiSearch(); break;
      case 'create-po':       this.onCreatePo(); break;
      case 'service-impact':  this.onServiceImpactClick(); break;
      case 'contact-centre':  this.onContactCentreClick(); break;
    }
  }

  onLsiSearch(): void {
    this.router.navigate(['/noc-portal']);
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
