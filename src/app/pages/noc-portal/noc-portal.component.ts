import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarNavItem } from '../change-management/shared/sidebar-nav/sidebar-nav.component';
import {
  NAV_ITEMS,
  NETWORK_ALARMS,
  NOC_SIDEBAR_ITEMS,
  OTN_SPAN_LOSS,
  PRODUCT_DETAILS,
  PROFILE,
  SR_NOTIFICATION_TABS,
  STATUS_FIELDS,
  THRESHOLD_ALARMS,
  TOP_UTILITY_ICONS,
} from './noc-portal.constants';
import {
  AlarmBadge, OtnSpanLossRow, PrimaryNavItem, ProductDetailField,
  SrDetails, SrInsightsCard, SrNotificationTab, StatusField, TopUtilityIcon,
} from './noc-portal.types';
import { SrDetailsService } from './services/sr-details.service';

@Component({
  selector: 'app-noc-portal',
  templateUrl: './noc-portal.component.html',
  styleUrls: ['./noc-portal.component.scss']
})
export class NocPortalComponent implements OnInit {

  constructor(private router: Router, private srDetailsService: SrDetailsService) {}

  // ---------- Responsive scale-to-fit (same approach as every other page) ----------
  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  ngOnInit(): void {
    this.updateScale();
  }

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / NocPortalComponent.DESIGN_WIDTH, 1);
  }

  // ---------- Left rail (markup/CSS cloned directly into this page — see
  // .np-sidebar* in noc-portal.component.scss — rather than reused via the
  // shared app-cm-sidebar-nav component; only the bottom 3 icons differ
  // from Change Management's own set, see NOC_SIDEBAR_ITEMS) ----------
  sidebarItems: SidebarNavItem[] = NOC_SIDEBAR_ITEMS;

  // 'dashboard' always means "go to the landing page", same convention as
  // the shared sidebar component; everything else goes through the key
  // switch below.
  onSidebarClick(item: SidebarNavItem): void {
    if (item.key === 'dashboard') {
      this.router.navigate(['/']);
      return;
    }
    this.onSidebarItemClick(item.key);
  }

  onSidebarItemClick(key: string): void {
    if (key === 'noc-escalation-matrix') {
      this.router.navigate(['/escalation-matrix']);
      return;
    }
    console.log('NOC Portal sidebar:', key);
  }

  // ---------- Top search bar ----------
  lsiQuery = 'LSI - 004821';
  // Renamed from the old poIdQuery now that this field's real job (search by
  // SR number to enter the SR Details state below) is actually built out.
  srQuery = '';

  // No backend anywhere in this app — same convention as every other
  // search/filter here (all-srs, escalated-srs, etc.): any non-empty value
  // is "valid". Search flips the main content area into the SR Details
  // state and fetches that SR's backend-driven sections; Reset clears the
  // field, the fetched data, and flips the view back.
  isSrStateActive = false;

  // True for a beat between clicking Search and the SR Details state
  // actually appearing — see .np-sr-transition-overlay. The mock service
  // resolves instantly, which read as nothing happening at all; a real API
  // call wouldn't be instant either, so this covers both: the delay isn't
  // fake latency for its own sake, it's the minimum time for the "you're on
  // a different page now" cue to actually register.
  isSrTransitioning = false;
  private static readonly SR_TRANSITION_MS = 550;

  // Crystalized RCA Conclusion + SR Insights' content — null until
  // SrDetailsService resolves. Subscribed (not async-piped) since it's
  // consumed from several places across the template; see onSearch().
  srDetails: SrDetails | null = null;

  onSearch(): void {
    if (this.srQuery.trim()) {
      this.isSrTransitioning = true;
      this.srDetailsService.getSrDetails(this.srQuery).subscribe(details => {
        setTimeout(() => {
          this.srDetails = details;
          this.isSrStateActive = true;
          this.isSrTransitioning = false;
        }, NocPortalComponent.SR_TRANSITION_MS);
      });
    }
    console.log('NOC Portal search:', this.lsiQuery, this.srQuery);
  }
  onReset(): void {
    this.srQuery = '';
    this.isSrStateActive = false;
    this.isSrTransitioning = false;
    this.srDetails = null;
    console.log('NOC Portal reset clicked');
  }

  // ---------- SR Details state ----------
  // Crystalized RCA Conclusion starts expanded; the other four (SR Journey
  // Summary included, now that it's a real accordion instance too — see
  // noc-portal.component.html) start collapsed.
  isSrJourneyExpanded = false;
  isSrInsightsExpanded = false;
  isRcaExpanded = true;
  isSrSummaryExpanded = false;
  isWorkNotesExpanded = false;

  // Placeholder actions on each SR Insights card — clickable, not wired to
  // real behavior yet.
  onSrInsightsExpand(card: SrInsightsCard): void {
    console.log('SR Insights: expand clicked', card.title);
  }
  onSrInsightsRefresh(card: SrInsightsCard): void {
    console.log('SR Insights: refresh clicked', card.title);
  }
  onSrInsightsInfo(card: SrInsightsCard): void {
    console.log('SR Insights: more info clicked', card.title);
  }

  onSrTaskJourneyClick(): void {
    console.log('SR Journey Summary: SR Task Journey clicked');
  }

  // ---------- SR Summary's own header-row controls — projected into the
  // shared accordion header via accordionExtra (same mechanism as SR
  // Journey Summary's compact stepper above), not a second title/toolbar
  // inside the section's own body. Lives at this level (not inside
  // SrSummaryComponent) for the same reason SR Journey's stepper does:
  // content projected into accordionExtra is parsed in THIS component's
  // template, so it can only bind to properties this component owns. ----------
  // All 5 share the same #64748B gray at the SVG level, so no per-icon CSS
  // border/recolor is needed — they're rendered uniformly by .np-srs-icon-circle.
  readonly srSummaryToolbarIcons = [
    { key: 'r',      icon: '/assets/NOC_Portal/Group ssr.svg',             alt: 'R' },
    { key: 'a',      icon: '/assets/NOC_Portal/Group ssr2.svg',            alt: 'A' },
    { key: 'clock',  icon: '/assets/NOC_Portal/solar_alarm-linearssr.svg', alt: 'Reminder' },
    { key: 'flash',  icon: '/assets/NOC_Portal/iconoir_auto-flashssr.svg', alt: 'Quick action' },
    { key: 'attach', icon: '/assets/NOC_Portal/proicons_attachssr.svg',    alt: 'Attach' },
  ];
  onSrSummaryToolbarIconClick(key: string): void {
    console.log('SR Summary toolbar icon:', key);
  }

  srSummarySearchQuery = '';
  onSrSummarySearch(): void {
    console.log('SR Summary search:', this.srSummarySearchQuery);
  }

  readonly srSummarySortOptions = ['Newest first', 'Oldest first', 'Priority'];
  srSummaryActiveSort = this.srSummarySortOptions[0];
  isSrSummarySortOpen = false;
  toggleSrSummarySort(): void {
    this.isSrSummarySortOpen = !this.isSrSummarySortOpen;
  }
  setSrSummarySort(opt: string): void {
    this.srSummaryActiveSort = opt;
    this.isSrSummarySortOpen = false;
  }

  // RefreshCwss.svg (not the green RefreshCw.svg used elsewhere) — same
  // #64748B gray as the other 4 toolbar icons, matching this row's color
  // instead of the green convention used in SR Insights/All Work Notes.
  readonly srSummaryRefreshIcon = '/assets/NOC_Portal/RefreshCwss.svg';
  isSrSummaryRefreshing = false;
  onSrSummaryRefresh(): void {
    this.isSrSummaryRefreshing = true;
    setTimeout(() => { this.isSrSummaryRefreshing = false; }, 700);
  }

  topUtilityIcons: TopUtilityIcon[] = TOP_UTILITY_ICONS;
  onTopUtilityClick(key: string): void {
    console.log('NOC Portal top utility icon:', key);
  }

  // ---------- Primary nav pills ----------
  navItems: PrimaryNavItem[] = NAV_ITEMS;

  // Each pill with a built-out modal gets its own open flag — 'ai-insights'
  // has no modal yet, so it stays a console.log like every pill used to be.
  isTopologyModalOpen = false;
  isLinkStatusModalOpen = false;
  isInventoryBlueprintModalOpen = false;
  isBundleSummaryModalOpen = false;
  isPerformanceKpiModalOpen = false;

  onNavItemClick(key: string): void {
    switch (key) {
      case 'topology':            this.isTopologyModalOpen = true; break;
      case 'link-status':         this.isLinkStatusModalOpen = true; break;
      case 'inventory-blueprint': this.isInventoryBlueprintModalOpen = true; break;
      case 'bundle-summary':      this.isBundleSummaryModalOpen = true; break;
      case 'performance':         this.isPerformanceKpiModalOpen = true; break;
      default:                    console.log('NOC Portal nav pill:', key);
    }
  }
  onNavEditClick(): void {
    console.log('NOC Portal nav edit clicked');
  }
  onNavMenuClick(): void {
    console.log('NOC Portal nav menu clicked');
  }

  // ---------- SR Notifications pill bar ----------
  notificationTabs: SrNotificationTab[] = SR_NOTIFICATION_TABS;
  setActiveNotificationTab(tab: SrNotificationTab): void {
    this.notificationTabs.forEach(t => (t.active = false));
    tab.active = true;
  }
  get totalNotificationCount(): number {
    return this.notificationTabs.reduce((sum, t) => sum + t.count, 0);
  }
  onNotificationsFilterClick(): void {
    console.log('NOC Portal notifications filter clicked');
  }
  onNotificationsPrevClick(): void {
    console.log('NOC Portal notifications: previous clicked');
  }
  onNotificationsNextClick(): void {
    console.log('NOC Portal notifications: next clicked');
  }

  // ---------- Summary cards ----------
  profile = PROFILE;
  onViewProfileDetails(): void {
    console.log('View full profile details:', this.profile.lsiTag);
  }

  networkAlarms: AlarmBadge[] = NETWORK_ALARMS;
  thresholdAlarms: AlarmBadge[] = THRESHOLD_ALARMS;

  otnSpanLoss: OtnSpanLossRow[] = OTN_SPAN_LOSS;
  onViewOtnDetails(): void {
    console.log('View full OTN span loss details');
  }

  statusFields: StatusField[] = STATUS_FIELDS;
  isStatusRefreshing = false;
  onStatusRefresh(): void {
    this.isStatusRefreshing = true;
    setTimeout(() => { this.isStatusRefreshing = false; }, 700);
  }
  onStatusInfoClick(): void {
    console.log('Status card: info clicked');
  }

  productDetails: ProductDetailField[] = PRODUCT_DETAILS;
  onProductDetailsInfoClick(): void {
    console.log('Product Details card: info clicked');
  }

  onCallClick(): void {
    console.log('Call clicked');
  }
  onBookClick(): void {
    console.log('Book clicked');
  }
}
