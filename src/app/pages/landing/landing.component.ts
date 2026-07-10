import { Component, HostListener, OnInit } from '@angular/core';
import { CardKey, NavTab } from './landing.types';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  // ---------- Responsive scale-to-fit (desktop canvas, >= 1024px) ----------
  // The desktop canvas is a fixed 1920x1444 design. Scale to the window's
  // WIDTH only (capped at 100% so it never upscales/blurs on huge displays)
  // so the canvas always fills the window edge-to-edge with no left/right
  // blank margins; the page scrolls vertically for the rest, same as any
  // normal webpage. (Fitting height too would leave letterboxing whenever
  // the window's aspect ratio isn't exactly 1920:1444, which is most
  // monitors.) Below 1024px the canvas is hidden in favor of .mobile-layout.
  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  ngOnInit(): void {
    this.updateScale();
  }

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / LandingComponent.DESIGN_WIDTH, 1);
  }

  // ---------- Topbar ----------
  // Lifted here (rather than owned by HeaderPartComponent) so the desktop
  // and mobile instances of that component share the same live state.
  portalTitle    = 'Welcome to CMF DJ Portal..!';
  portalSubtitle = 'Walk through our exclusive Digital Journey portal';
  searchPlaceholder = 'Search services, devices, or alerts...';
  searchQuery = '';
  userInitials = 'AG';
  userName = 'Akash.G';
  userRole = 'NOC Lead';
  isUserMenuOpen = false;

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (!query) {
      return;
    }
    console.log('Searching for:', query);
    // TODO: wire this up to your real search endpoint / router query params
  }

  onDocumentsClick(): void {
    console.log('Documents icon clicked');
    // TODO: open documents panel or navigate to /documents
  }

  onNotificationsClick(): void {
    console.log('Notifications icon clicked');
    // TODO: open notifications panel or navigate to /notifications
  }

  onUserMenuAction(action: 'preferences' | 'profile' | 'settings' | 'logout'): void {
    console.log('User menu action:', action);
    // TODO: route to the relevant page or perform logout
  }

  // ---------- Analytics Nav Tabs ----------
  // Lifted here (rather than owned by AnalyticsOverviewComponent) because
  // the active tab also drives the 2x2 grid card reordering below, which is
  // shared across the desktop/mobile instances of 4 sibling card components.
  navTabs: NavTab[] = [
    { label: 'SR overview',        active: false },
    { label: 'Incident management',active: false },
    { label: 'Change management',  active: false },
    { label: 'Escalation matrix',  active: true  },
  ];
  setActiveTab(tab: NavTab): void {
    this.navTabs.forEach(t => (t.active = false));
    tab.active = true;
  }

  activeInterface: 'classic' | 'enhanced' = 'enhanced';
  setInterface(mode: 'classic' | 'enhanced'): void {
    this.activeInterface = mode;
  }

  // ---------- Grid card reordering (SR overview / Incident / Change / Escalation) ----------
  // Fixed cycle order used to fill positions 2, 3, 4 after the selected card takes position 1.
  private readonly cardCycle: CardKey[] = ['sr', 'incident', 'change', 'escalation'];

  // Pixel positions for the 2x2 grid slots (top-left, top-right, bottom-left, bottom-right)
  private readonly gridPositions: { top: number; left: number }[] = [
    { top: 453, left: 33 },   // slot 0: top-left
    { top: 453, left: 973 },  // slot 1: top-right
    { top: 933, left: 33 },   // slot 2: bottom-left
    { top: 933, left: 973 },  // slot 3: bottom-right
  ];

  private readonly tabLabelToCardKey: Record<string, CardKey> = {
    'SR overview': 'sr',
    'Incident management': 'incident',
    'Change management': 'change',
    'Escalation matrix': 'escalation',
  };

  get activeCardKey(): CardKey {
    const activeTab = this.navTabs.find(t => t.active);
    return this.tabLabelToCardKey[activeTab?.label ?? 'Escalation matrix'];
  }

  // Rotates the fixed cycle so the selected card is first, keeping the other
  // three in the same relative SR -> Incident -> Change -> Escalation order.
  get cardOrder(): CardKey[] {
    const idx = this.cardCycle.indexOf(this.activeCardKey);
    return [...this.cardCycle.slice(idx), ...this.cardCycle.slice(0, idx)];
  }

  getCardPosition(key: CardKey): { top: number; left: number } {
    const slot = this.cardOrder.indexOf(key);
    return this.gridPositions[slot];
  }
}
