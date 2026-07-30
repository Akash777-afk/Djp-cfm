import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardChangeRow, DashboardChangeStatus, StatCard } from './change-management-landing.types';

interface StatCardMeta {
  key: string;
  label: string;
  viewText: string;
  color: string;
  bg: string;
  icon: string;
}

@Component({
  selector: 'app-change-management-landing',
  templateUrl: './change-management-landing.component.html',
  styleUrls: ['./change-management-landing.component.scss']
})
export class ChangeManagementLandingComponent implements OnInit {

  constructor(private router: Router) {}

  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  ngOnInit(): void {
    this.updateScale();
  }

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / ChangeManagementLandingComponent.DESIGN_WIDTH, 1);
  }

  userName = 'Akash Ganapathy2';

  // 43 mock changes, split roughly evenly across Emergency/Planned/Open — none
  // of which are tracked stat-card categories, so only "All Changes" carries a
  // real count; Scheduled, Rejected, In Progress, Completed and Cancelled stay
  // genuinely empty.
  changes: DashboardChangeRow[] = this.buildMockChanges();

  private buildMockChanges(): DashboardChangeRow[] {
    const statuses: DashboardChangeStatus[] = ['Emergency', 'Planned', 'Open'];
    const total = 43;
    const rows: DashboardChangeRow[] = [];
    for (let i = 0; i < total; i++) {
      const outageId = 1100461492 + i;
      rows.push({
        changeId: i === 0 ? '1234567890' : `CRQ0000${(6792249 + i).toString()}`,
        plannedOutageId: outageId.toString(),
        status: statuses[i % statuses.length],
        createdOn: '01 July 2026, 09:23 AM',
      });
    }
    return rows;
  }

  // Which single card is currently "active" (special style + table filter).
  // Defaults to 'all' since the table starts out showing every change.
  activeCardKey = 'all';

  private readonly cardMeta: StatCardMeta[] = [
    { key: 'all',          label: 'All Changes', viewText: 'View all changes', color: '#ed7199', bg: 'rgba(237, 113, 153, 0.08)', icon: '/assets/Icon-6.png' },
    { key: 'scheduled',    label: 'Scheduled',   viewText: 'View scheduled',   color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)',  icon: '/assets/Iconsch.png' },
    { key: 'rejected',     label: 'Rejected',    viewText: 'View rejected',    color: '#e60012', bg: '#fef2f2',                    icon: '/assets/Icon-5.png' },
    { key: 'in-progress',  label: 'In Progress', viewText: 'View in progress', color: '#4664aa', bg: 'rgba(70, 100, 170, 0.08)',  icon: '/assets/Icon-4.png' },
    { key: 'completed',    label: 'Completed',   viewText: 'View completed',   color: '#22c55e', bg: 'rgba(99, 205, 90, 0.08)',   icon: '/assets/Icon-3.png' },
    { key: 'cancelled',    label: 'Cancelled',   viewText: 'View cancelled',   color: '#ff9900', bg: 'rgba(255, 153, 0, 0.08)',   icon: '/assets/Icon-2.png' },
  ];

  private readonly keyToStatus: Record<string, DashboardChangeStatus> = {
    scheduled: 'Scheduled',
    rejected: 'Rejected',
    'in-progress': 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  get statCards(): StatCard[] {
    const count = (status: DashboardChangeStatus) => this.changes.filter(c => c.status === status).length;
    return this.cardMeta.map(meta => ({
      key: meta.key,
      label: meta.label,
      count: meta.key === 'all' ? this.changes.length : count(this.keyToStatus[meta.key]),
      viewText: meta.viewText,
      color: meta.color,
      bg: meta.bg,
      icon: meta.icon,
      special: meta.key === this.activeCardKey,
    }));
  }

  // null = no filter (show every row), matching the 'all' card.
  get statusFilter(): DashboardChangeStatus | null {
    return this.activeCardKey === 'all' ? null : this.keyToStatus[this.activeCardKey];
  }

  setActiveCard(key: string): void {
    this.activeCardKey = key;
  }

  // The dashboard has no planned-outages table of its own to append a new
  // row to (that only exists on the CRQ page) — opening the modal here just
  // lets the flow be started from anywhere; submitting still shows the same
  // success confirmation, it just has nowhere local to persist the row.
  isCreatePoModalOpen = false;

  onCreatePoClick(): void {
    this.isCreatePoModalOpen = true;
  }

  onCreatePoModalClosed(): void {
    this.isCreatePoModalOpen = false;
  }

  isServiceImpactModalOpen = false;

  onServiceImpactClick(): void {
    this.isServiceImpactModalOpen = true;
  }

  onServiceImpactModalClosed(): void {
    this.isServiceImpactModalOpen = false;
  }

  isContactCentreModalOpen = false;

  onContactCentreClick(): void {
    this.isContactCentreModalOpen = true;
  }

  onContactCentreModalClosed(): void {
    this.isContactCentreModalOpen = false;
  }

  onCallClick(): void {
    console.log('Call clicked');
  }
  onBookClick(): void {
    console.log('Book clicked');
  }

  goToCrq(changeId: string): void {
    this.router.navigate(['/change-management/crq']);
  }
}
