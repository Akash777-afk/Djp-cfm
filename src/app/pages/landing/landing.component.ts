import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlanceTile, MainCardKey, NavTabItem, SectionVariant } from './landing.types';

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

  // No destination exists yet for any of these 3 actions.
  onSettingsClick(): void {
    console.log('Analytics overview: settings clicked');
  }
  onAddClick(): void {
    console.log('Analytics overview: add clicked');
  }
  onExternalLinkClick(): void {
    console.log('Analytics overview: external-link clicked');
  }

  // ---------- Glanceable tiles (top of page) ----------
  glanceTiles: GlanceTile[] = [
    { label: 'NOC Portal', action: () => this.onNocPortalClick() },
    { label: 'Incident management', action: () => this.goToIncidentManagement() },
    { label: 'Change Management', action: () => this.goToChangeManagement() },
    { label: 'SR Overview', action: () => this.jumpToAnalyticsTab('SR Overview') },
    { label: 'Escalation Matrix', action: (variant) => this.onEscalationMatrixTileClick(variant) },
  ];

  // Desktop: navigate straight to the full escalation matrix page.
  // Mobile: keep the existing scroll-to-tab behavior (unchanged for now).
  onEscalationMatrixTileClick(variant?: SectionVariant): void {
    if (variant === 'desktop') {
      this.router.navigate(['/escalation-matrix']);
    } else {
      this.jumpToAnalyticsTab('Escalation matrix');
    }
  }

  onNocPortalClick(): void {
    this.router.navigate(['/noc-portal']);
  }

  goToChangeManagement(): void {
    this.router.navigate(['/change-management']);
  }

  goToIncidentManagement(): void {
    this.router.navigate(['/incident-management']);
  }

  // Brings the Analytics Overview section's matching tab to the front and
  // scrolls it into view, since it now sits below the glanceable tiles.
  jumpToAnalyticsTab(label: string): void {
    this.activateTabByLabel(label);
    document.getElementById('analytics-overview-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  // ---------- Main nav tabs + 2x2 grid (Analytics Overview section) ----------
  navTabs: NavTabItem[] = [
    { label: 'SR Overview',          active: true  },
    { label: 'Incident management',  active: false },
    { label: 'Change management',    active: false },
    { label: 'Escalation matrix',    active: false },
    { label: 'Problem management',   active: false },
    { label: 'Proactive automation', active: false },
  ];

  private readonly mainCardCycle: MainCardKey[] = ['sr', 'incident', 'change', 'escalation'];
  private readonly mainGridPositions: { top: number; left: number }[] = [
    { top: 491, left: 30 },   // top-left
    { top: 491, left: 976 },  // top-right
    { top: 975, left: 30 },   // bottom-left
    { top: 975, left: 976 },  // bottom-right
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

  activateTabByLabel(label: string): void {
    const tab = this.navTabs.find(t => t.label === label);
    if (tab) { this.setActiveTab(tab); }
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
