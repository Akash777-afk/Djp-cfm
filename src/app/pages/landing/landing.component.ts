import { Component, ElementRef, HostListener } from '@angular/core';

interface NavTab {
  label: string;
  active: boolean;
}

interface IncidentStat {
  value: string;
  label: string;
  bg: string;
  border: string;
  color: string;
  width: number;
}

interface IncidentBar {
  height: number;
  active: boolean;
}

interface SrRow {
  srNumber: string;
  riseDate: string;
  summary: string;
  subType: 'Parent' | 'Child';
  escalationLevel: string;
  badgeClass: string;
  badgeDotClass: string;
  trackingPercent: number;
  trackingColor: string;
  isLast: boolean;
}

interface EscalationLevel {
  label: string;
  dotColor: string;
  count: number;
  percent: string;
  isLast: boolean;
}

interface ChangeRow {
  outageId: string;
  crq: string;
  impact: string;
  implementor: string;
  submitted: boolean;
  isLast: boolean;
}

type ModuleKey =
  | 'noc-portal'
  | 'proactive-automation'
  | 'incident-management'
  | 'problem-management'
  | 'change-management';

type ExpandableCard = 'sr' | 'incident' | 'escalation' | 'change';
type CardKey = 'sr' | 'incident' | 'change' | 'escalation';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  constructor(private elementRef: ElementRef) {}

  // ---------- Topbar ----------
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

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  onUserMenuAction(action: 'preferences' | 'profile' | 'settings' | 'logout'): void {
    console.log('User menu action:', action);
    this.isUserMenuOpen = false;
    // TODO: route to the relevant page or perform logout
  }

  // Close the user dropdown when clicking anywhere outside it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isUserMenuOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpen = false;
    }
  }

  // ---------- Module nav tiles ----------
  navigateToModule(moduleKey: ModuleKey): void {
    console.log('Navigate to module:', moduleKey);
    // TODO: replace with real navigation, e.g. this.router.navigate(['/', moduleKey]);
  }

  // ---------- Card expand icons ----------
  onExpandCard(cardKey: ExpandableCard): void {
    console.log('Expand card:', cardKey);
    // TODO: open a full-screen modal / dedicated route for this card
  }

  // ---------- Interface Toggle ----------
  activeInterface: 'classic' | 'enhanced' = 'enhanced';
  setInterface(mode: 'classic' | 'enhanced'): void {
    this.activeInterface = mode;
  }

  // ---------- Analytics Nav Tabs ----------
  analyticsTitle    = 'Analytics Overview';
  analyticsSubtitle = 'Real-time insights and performance metrics';

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

  // ---------- Incident Management card ----------
  incidentCardTitle    = 'Incident management';
  incidentCardSubtitle = 'Real-Time Incident Management for all Networks.';

  incidentStats: IncidentStat[] = [
    { value: '06',    label: 'Unknown',     bg: '#f2f7ff', border: '#e6e6e6', color: '#94a3b8', width: 92 },
    { value: '342',   label: 'In Progress', bg: '#eff6ff', border: '#d9e8fc', color: '#2563eb', width: 94 },
    { value: '156',   label: 'Assigned',    bg: '#f5f3ff', border: '#e2dcff', color: '#8b5cf6', width: 93 },
    { value: '18',    label: 'Escalated',   bg: '#fef2f2', border: '#ffe1e1', color: '#e60012', width: 92 },
    { value: '524',   label: 'Resolved',    bg: '#f0fdf4', border: '#c3ffd9', color: '#16a34a', width: 92 },
    { value: '189',   label: 'Closed',      bg: '#f8fafc', border: '#e2eaf5', color: '#475569', width: 93 },
    { value: '12',    label: 'Cancelled',   bg: '#fffbeb', border: '#ffebd3', color: '#d97706', width: 94 },
    { value: '1,247', label: 'Total',       bg: '#f8fafc', border: '#e4ecf4', color: '#0f172a', width: 92 },
  ];

  incidentBars: IncidentBar[] = [
    { height: 26,  active: false },
    { height: 107, active: false },
    { height: 65,  active: false },
    { height: 18,  active: false },
    { height: 145, active: false },
    { height: 65,  active: false },
    { height: 18,  active: false },
    { height: 182, active: true  },
  ];

  incidentYLabels: string[] = ['1000', '500', '250', '100', '0'];
  incidentXLabels: string[] = ['Unknown', 'In progress', 'Assigned', 'Escalated', 'Resolved', 'Closed', 'Cancelled', 'Total'];

  // ---------- SR Overview card ----------
  srCardTitle    = 'SR overview';
  srCardSubtitle = 'Manage service requests from submission to resolution.';

  srRows: SrRow[] = [
    {
      srNumber: 'SR-35870455', riseDate: '07/20/2024', summary: 'Link Down',
      subType: 'Parent', escalationLevel: 'Level 2',
      badgeClass: 'badge',  badgeDotClass: 'prioritybadge',
      trackingPercent: 15, trackingColor: '#26b55c', isLast: false
    },
    {
      srNumber: 'SR-35870455', riseDate: '07/20/2024', summary: 'Link Flapping',
      subType: 'Child', escalationLevel: 'Level 3',
      badgeClass: 'badge2', badgeDotClass: 'prioritybadge2',
      trackingPercent: 30, trackingColor: 'rgba(34,197,94,0.6)', isLast: false
    },
    {
      srNumber: 'SR-35870455', riseDate: '07/20/2024', summary: 'Link Flapping',
      subType: 'Parent', escalationLevel: 'Level 4',
      badgeClass: 'badge3', badgeDotClass: 'prioritybadge3',
      trackingPercent: 55, trackingColor: '#f59e0b', isLast: false
    },
    {
      srNumber: 'SR-35870455', riseDate: '07/20/2024', summary: 'Link Down',
      subType: 'Parent', escalationLevel: 'Level 5',
      badgeClass: 'badge4', badgeDotClass: 'prioritybadge4',
      trackingPercent: 68, trackingColor: '#e20010', isLast: true
    },
  ];

  // ---------- Escalation Matrix card ----------
  escalationCardTitle    = 'Escalation matrix';
  escalationCardSubtitle = 'Streamline issue escalation with clear ownership and workflows.';
  totalEscalated = '419';

  escalationLevels: EscalationLevel[] = [
    { label: 'Level 1', dotColor: '#22c55e', count: 47,  percent: '11.2%', isLast: false },
    { label: 'Level 2', dotColor: '#3b82f6', count: 148, percent: '35.3%', isLast: false },
    { label: 'Level 3', dotColor: '#f59e0b', count: 105, percent: '25.1%', isLast: false },
    { label: 'Level 4', dotColor: '#e60012', count: 92,  percent: '22.0%', isLast: false },
    { label: 'Level 5', dotColor: '#8b5cf6', count: 27,  percent: '6.4%',  isLast: false },
    { label: 'Level 6', dotColor: '#dedce2', count: 0,   percent: '—',     isLast: true  },
  ];

  // ---------- Dynamic donut chart ----------
  // Bigger donut: radius 140, circumference = 2π × 140 ≈ 879.6
  private readonly DONUT_RADIUS = 140;
  readonly donutCircumference = 2 * Math.PI * this.DONUT_RADIUS;

  private readonly SEGMENT_GAP = 0;

  // Each segment: arc shrunk by gap on each side, offset accounts for gap
  get donutSegments(): { color: string; dashArray: string; dashOffset: number }[] {
    const total = this.escalationLevels.reduce((s, l) => s + l.count, 0);
    if (total === 0) return [];

    let offset = 0;
    return this.escalationLevels.map(level => {
      const rawArc = (level.count / total) * this.donutCircumference;
      const arc    = Math.max(rawArc - this.SEGMENT_GAP, 0);
      const gap    = this.donutCircumference - arc;
      const seg = {
        color:      level.dotColor,
        dashArray:  `${arc} ${gap}`,
        dashOffset: -(offset + this.SEGMENT_GAP / 2),
      };
      offset += rawArc;
      return seg;
    });
  }

  // ---------- Change Management card ----------
  changeCardTitle    = 'Change management';
  changeCardSubtitle = 'Control network changes with secure approvals and seamless execution.';

  changeRows: ChangeRow[] = [
    { outageId: '110039400', crq: 'CRQ000005963007', impact: 'Service affecting', implementor: 'A11YUHO@airtel.com', submitted: true,  isLast: false },
    { outageId: '110039431', crq: 'CRQ000005963008', impact: 'Service affecting', implementor: 'A12IUGP@airtel.com', submitted: true,  isLast: false },
    { outageId: '110039442', crq: 'CRQ000005963011', impact: 'Service affecting', implementor: 'A13JKFJ@airtel.com', submitted: false, isLast: false },
    { outageId: '110039478', crq: 'CRQ000005963016', impact: 'Service affecting', implementor: 'A14KUYh@airtel.com', submitted: true,  isLast: true  },
  ];
}