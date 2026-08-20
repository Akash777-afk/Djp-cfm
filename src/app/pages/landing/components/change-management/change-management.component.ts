import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SectionVariant } from '../../landing.types';
import { ChangeManagementService } from '../../../change-management/services/change-management.service';
import { StatCard } from '../../../change-management/landing/change-management-landing.types';

interface ChangeBar { label: string; height: number; active: boolean; }
interface ChangeYLabel { label: string; top: number; }

@Component({
  selector: 'app-landing-change-management',
  templateUrl: './change-management.component.html',
  styleUrls: ['./change-management.component.scss']
})
export class ChangeManagementCardComponent implements OnInit {

  constructor(
    private router: Router,
    private cmService: ChangeManagementService,
  ) {}

  @Input() variant: SectionVariant = 'desktop';

  // Position within the reorderable 2x2 grid, supplied by LandingComponent.
  @Input() top = 0;
  @Input() left = 0;
  @Input() order = 0;

  changeCardTitle    = 'Change management';
  changeCardSubtitle = 'Control network changes with secure approvals and seamless execution.';

  // Populated from ChangeManagementService.getDashboardData() in ngOnInit()
  // below — statCards already gives a full per-status breakdown (All/
  // Scheduled/Rejected/In Progress/Completed/Cancelled) with the exact same
  // colors the real Change Management landing page's own stat cards use,
  // so this card can't show a status in a different color than the real
  // page.
  statCards: StatCard[] = [];
  // Same 6 cards as statCards, reordered so the aggregate "All Changes"
  // total comes last — feeds both the bar chart (bars) and the pill list
  // on the card's right, matching the redesigned chart-left/pills-right
  // layout (breakdown first, then the total).
  pillCards: StatCard[] = [];
  bars: ChangeBar[] = [];
  yLabels: ChangeYLabel[] = [];

  // Must stay in sync with .cm-bar-parent's height in the .scss — the pixel
  // math below (bar heights, y-label top offsets) is derived against this
  // exact value.
  private readonly barAreaHeightPx = 274;

  // Drives app-card-loading-overlay — see the identical note on
  // IncidentManagementCardComponent.isLoading for why no separate
  // "now show mock" step is needed here.
  isLoading = true;

  ngOnInit(): void {
    this.cmService.getDashboardData().subscribe(({ statCards }) => {
      this.isLoading = false;
      this.statCards = statCards;

      // "All Changes" is charted alongside the 5 individual statuses (as
      // its own dominant bar, since it's their sum) rather than excluded —
      // reordered to the end so the breakdown reads left-to-right before
      // the total, matching the pill list's order on the right.
      const breakdown = statCards.filter(c => c.key !== 'all');
      const allCard = statCards.find(c => c.key === 'all');
      this.pillCards = allCard ? [...breakdown, allCard] : breakdown;

      const maxCount = Math.max(...this.pillCards.map(c => c.count), 1);
      const axisMax = Math.max(5, Math.ceil(maxCount / 5) * 5);

      // Bars use the same 2-color scheme as the Incident Management landing
      // card's chart (pale pink for every individual status, solid red only
      // for the aggregate "All Changes" bar) rather than each bar in its
      // own status color — see .cm-bar-item / .cm-bar-active in the .scss.
      this.bars = this.pillCards.map(c => ({
        label: c.label,
        height: Math.round((c.count / axisMax) * this.barAreaHeightPx),
        active: c.key === 'all',
      }));
      // 6 gridlines/labels (axisMax down to 0 in 5 even steps), top-offset
      // in pixels so the template can position each one directly instead of
      // re-deriving the same fraction math in the markup.
      this.yLabels = [5, 4, 3, 2, 1, 0].map(n => ({
        label: String(Math.round((axisMax * n) / 5)),
        top: Math.round((this.barAreaHeightPx * (5 - n)) / 5),
      }));
    });
  }

  onExpandCard(): void {
    this.router.navigate(['/change-management']);
  }
}
