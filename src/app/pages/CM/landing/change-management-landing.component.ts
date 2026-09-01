import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardChangeRow, StatCard } from './change-management-landing.types';
import { CM_SIDEBAR_ITEMS, SidebarNavItem } from '../components/sidebar-nav/sidebar-nav.component';
import { ChangeManagementService } from '../services/change-management.service';
import { SessionService } from '../../../services/session.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-change-management-landing',
  templateUrl: './change-management-landing.component.html',
  styleUrls: ['./change-management-landing.component.scss']
})
export class ChangeManagementLandingComponent implements OnInit {

  constructor(
    private router: Router,
    private cmService: ChangeManagementService,
    private session: SessionService,
    private loadingService: LoadingService,
  ) {}

  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  ngOnInit(): void {
    this.updateScale();
    this.fetchDashboard();

    this.session.getCurrentUser().subscribe(user => {
      const name = user?.userData?.givenName;
      if (name) { this.userName = name; }
    });
    this.session.logActivity({
      System: 'Change Management',
      'OLM ID': this.userName,
      Action: 'View',
      Comments: 'User viewed Change Management dashboard',
    }).subscribe();
  }

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / ChangeManagementLandingComponent.DESIGN_WIDTH, 1);
  }

  userName = 'Akash Ganapathy2';

  // ---------- Dashboard data (stat cards + changes) ----------
  isLoading = true;
  changes: DashboardChangeRow[] = [];
  statCards: StatCard[] = [];

  private fetchDashboard(fromDate?: string, toDate?: string): void {
    this.isLoading = true;
    this.loadingService.show();
    this.cmService.getDashboardData(fromDate, toDate).subscribe(({ statCards, changes }) => {
      this.statCards = statCards.map(c => ({ ...c, special: c.key === this.activeCardKey }));
      this.changes = changes;
      this.isLoading = false;
      this.loadingService.hide();
    });
  }

  // Re-fetches with an explicit date range — mirrors DJP's onSubmit().
  onDateRangeSearch(range: { fromDate?: string; toDate?: string }): void {
    this.fetchDashboard(range.fromDate, range.toDate);
  }

  // Which single card is currently "active" (special style + table filter).
  activeCardKey = 'all';

  private readonly keyToStatus: Record<string, string> = {
    scheduled: 'Scheduled', rejected: 'Rejected', 'in-progress': 'In Progress',
    completed: 'Completed', cancelled: 'Cancelled',
  };

  get statusFilter(): string | null {
    return this.activeCardKey === 'all' ? null : this.keyToStatus[this.activeCardKey];
  }

  setActiveCard(key: string): void {
    this.activeCardKey = key;
    this.statCards = this.statCards.map(c => ({ ...c, special: c.key === key }));
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

  // Real broadcast-call hyperlink (shared API, same as EM/IM's onCallClick).
  onCallClick(): void {
    this.session.getHyperLinkNavurls().subscribe(data => {
      const url = data?.IM?.broadCastCall;
      if (url) { window.open(url); }
    });
  }
  onBookClick(): void {
    console.log('Book clicked');
  }

  goToCrq(changeId: string): void {
    this.router.navigate(['/change-management/crq']);
  }

  sidebarItems: SidebarNavItem[] = CM_SIDEBAR_ITEMS;

  onSidebarItemClick(key: string): void {
    switch (key) {
      case 'lsi-search':      this.onLsiSearch(); break;
      case 'create-po':       this.onCreatePoClick(); break;
      case 'service-impact':  this.onServiceImpactClick(); break;
      case 'contact-centre':  this.onContactCentreClick(); break;
    }
  }

  onLsiSearch(): void {
    this.router.navigate(['/noc-portal']);
  }
}
