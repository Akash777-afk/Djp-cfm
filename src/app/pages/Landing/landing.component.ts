import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MainCardKey, NavTabItem } from './landing.types';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  constructor(private router: Router) {}

  // ---------- Responsive scale-to-fit (desktop canvas, >= 1024px) ----------
  // A fixed 1920-wide design, scaled to the window's width only (capped at
  // 100%) so the canvas fills edge-to-edge with no left/right letterboxing;
  // the page scrolls vertically past that.
  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  ngOnInit(): void {
    this.updateScale();
  }

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / LandingComponent.DESIGN_WIDTH, 1);
  }

  analyticsTitle = 'Analytics Overview';
  analyticsSubtitle = 'Real-time insights and performance metrics';

  // Replaces the old Settings/Add/Open-externally icon row (none of which
  // had a real destination — see prior console.log stubs in git history).
  // No other component reads/sets this today; this is the only place the
  // Enhanced/Classical UI mode lives, so there's nothing else to reuse.
  uiMode: 'enhanced' | 'classical' = 'enhanced';

  setUiMode(mode: 'enhanced' | 'classical'): void {
    this.uiMode = mode;
  }

  // ---------- Main nav tabs + 2x2 grid (Analytics Overview section) ----------
  navTabs: NavTabItem[] = [
    { label: 'Change management',    active: true  },
    { label: 'Incident management',  active: false },
    { label: 'Escalation matrix',    active: false },
    { label: 'SR Overview',          active: false },
    { label: 'Problem management',   active: false, desktopLabel: 'NOC Portal', route: '/noc-portal' },
    { label: 'Proactive automation', active: false },
  ];

  // Shifted up 273px from their original 491/975 values now that the
  // product-shell header bar and glanceable tiles (which used to occupy the
  // top 273px of this canvas) are gone — see landing.component.scss's
  // matching shift on .aop-header/.aop-tab-bar/.aop-separator and the
  // reduced .aop-scale-wrapper/.aop-canvas height.
  // Default/rest order: Change management, Incident management, Escalation
  // matrix, SR overview — 1st/2nd/3rd/4th in the grid whenever no tab has
  // been clicked yet (navTabs above defaults 'Change management' to
  // active, so this cycle already starts on it and needs no rotation).
  private readonly mainCardCycle: MainCardKey[] = ['change', 'incident', 'escalation', 'sr'];
  private readonly mainGridPositions: { top: number; left: number }[] = [
    { top: 218, left: 30 },   // top-left
    { top: 218, left: 976 },  // top-right
    { top: 702, left: 30 },   // bottom-left
    { top: 702, left: 976 },  // bottom-right
  ];
  private readonly mainTabLabelToCardKey: Record<string, MainCardKey> = {
    'SR Overview': 'sr',
    'Incident management': 'incident',
    'Change management': 'change',
    'Escalation matrix': 'escalation',
  };

  setActiveTab(tab: NavTabItem): void {
    this.navTabs.forEach(t => (t.active = false));
    tab.active = true;
  }

  // Desktop tab bar only (see NavTabItem.route) — e.g. the NOC Portal tab
  // has no card of its own, it just navigates away from this page.
  onDesktopTabClick(tab: NavTabItem): void {
    this.setActiveTab(tab);
    if (tab.route) {
      this.router.navigate([tab.route]);
    }
  }

  get activeMainCardKey(): MainCardKey | undefined {
    const activeTab = this.navTabs.find(t => t.active);
    return activeTab ? this.mainTabLabelToCardKey[activeTab.label] : undefined;
  }

  // 'Problem management' / 'Proactive automation' have no card yet, so there's
  // nothing to bring forward — fall back to the default cycle order instead.
  get mainCardOrder(): MainCardKey[] {
    const key = this.activeMainCardKey;
    if (!key) { return this.mainCardCycle; }
    const idx = this.mainCardCycle.indexOf(key);
    return [...this.mainCardCycle.slice(idx), ...this.mainCardCycle.slice(0, idx)];
  }

  getMainCardPosition(key: MainCardKey): { top: number; left: number } {
    const slot = this.mainCardOrder.indexOf(key);
    return this.mainGridPositions[slot];
  }
}
