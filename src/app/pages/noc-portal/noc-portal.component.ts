import { Component, HostListener, OnInit } from '@angular/core';
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
import { AlarmBadge, OtnSpanLossRow, PrimaryNavItem, ProductDetailField, SrNotificationTab, StatusField, TopUtilityIcon } from './noc-portal.types';

@Component({
  selector: 'app-noc-portal',
  templateUrl: './noc-portal.component.html',
  styleUrls: ['./noc-portal.component.scss']
})
export class NocPortalComponent implements OnInit {

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

  // ---------- Left rail (exact Change Management sidebar shell; only the
  // bottom 3 icons differ — see NOC_SIDEBAR_ITEMS) ----------
  sidebarItems: SidebarNavItem[] = NOC_SIDEBAR_ITEMS;
  onSidebarItemClick(key: string): void {
    console.log('NOC Portal sidebar:', key);
  }

  // ---------- Top search bar ----------
  lsiQuery = 'LSI - 98907897990011';
  poIdQuery = 'PO ID - 110039400';

  onSearch(): void {
    console.log('NOC Portal search:', this.lsiQuery, this.poIdQuery);
  }
  onReset(): void {
    console.log('NOC Portal reset clicked');
  }

  topUtilityIcons: TopUtilityIcon[] = TOP_UTILITY_ICONS;
  onTopUtilityClick(key: string): void {
    console.log('NOC Portal top utility icon:', key);
  }

  // ---------- Primary nav pills ----------
  navItems: PrimaryNavItem[] = NAV_ITEMS;
  onNavItemClick(key: string): void {
    console.log('NOC Portal nav pill:', key);
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
