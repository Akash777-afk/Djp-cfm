import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncidentBar, IncidentStat, SectionVariant } from '../../landing.types';
import { IncidentManagementService } from '../../../IM/services/incident-management.service';

// Chrome (bg/border/color/width) is this card's own presentation, not
// something any API returns — kept local and keyed by the real StatTile
// key (see IncidentManagementService.buildStatTiles) so it survives
// whatever values the API sends without needing a matching entry per value.
interface StatChrome { bg: string; border: string; color: string; width: number; }
const STAT_CHROME: Record<string, StatChrome> = {
  unknown:        { bg: '#f2f7ff', border: '#e6e6e6', color: '#94a3b8', width: 92 },
  'in-progress':  { bg: '#eff6ff', border: '#d9e8fc', color: '#2563eb', width: 94 },
  assigned:       { bg: '#f5f3ff', border: '#e2dcff', color: '#8b5cf6', width: 93 },
  escalated:      { bg: '#fef2f2', border: '#ffe1e1', color: '#e60012', width: 92 },
  resolved:       { bg: '#f0fdf4', border: '#c3ffd9', color: '#16a34a', width: 92 },
  closed:         { bg: '#f8fafc', border: '#e2eaf5', color: '#475569', width: 93 },
  cancelled:      { bg: '#fffbeb', border: '#ffebd3', color: '#d97706', width: 94 },
  all:            { bg: '#f8fafc', border: '#e4ecf4', color: '#0f172a', width: 92 }, // "Total"
};
// Display order + label — same 8 categories IncidentManagementService's
// buildStatTiles() always produces, 'all' relabeled "Total" for this card
// (matches the original design's 8th column).
const STAT_ORDER: { key: string; label: string }[] = [
  { key: 'unknown', label: 'Unknown' },
  { key: 'in-progress', label: 'In Progress' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'closed', label: 'Closed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'all', label: 'Total' },
];

@Component({
  selector: 'app-landing-incident-management',
  templateUrl: './incident-management.component.html',
  styleUrls: ['./incident-management.component.scss']
})
export class IncidentManagementCardComponent implements OnInit {

  constructor(
    private router: Router,
    private imService: IncidentManagementService,
  ) {}

  @Input() variant: SectionVariant = 'desktop';

  // Position within the reorderable 2x2 grid, supplied by LandingComponent.
  @Input() top = 0;
  @Input() left = 0;
  @Input() order = 0;

  incidentCardTitle    = 'Incident management';
  incidentCardSubtitle = 'Real-Time Incident Management for all Networks.';

  // Populated from IncidentManagementService.getDashboardData() in
  // ngOnInit() below — the same real API (with the same real+mock-fallback
  // behavior) the actual Incident Management page itself calls, not a
  // separate/duplicate integration. Initialized to an all-zero placeholder
  // set (same 8 categories, real chrome) so the card's layout is already
  // correct and stable during the brief loading window rather than empty.
  incidentStats: IncidentStat[] = STAT_ORDER.map(s => ({ value: '0', label: s.label, ...STAT_CHROME[s.key] }));
  incidentBars: IncidentBar[] = STAT_ORDER.map(s => ({ height: 0, active: s.key === 'all' }));
  incidentYLabels: string[] = ['0', '0', '0', '0', '0'];
  incidentXLabels: string[] = STAT_ORDER.map(s => s.label);

  // Drives app-card-loading-overlay — true for exactly as long as
  // getDashboardData()'s call is in flight, tied to the real Observable
  // lifecycle (not a timeout). The service's own catchError already
  // resolves to mock data on failure before emitting, so this flips to
  // false and the (real-or-mock) data lands in the same tick either way —
  // there's no separate "now show mock" step to add here, the service
  // already produced whichever one belongs on screen by the time this
  // fires. See IncidentManagementService.getDashboardData()'s doc comment.
  isLoading = true;

  ngOnInit(): void {
    // No olmId available on the landing page (no session lookup here) —
    // same unscoped call IncidentManagementComponent itself makes before
    // its own session lookup resolves; not a new assumption.
    this.imService.getDashboardData().subscribe(({ statTiles }) => {
      this.isLoading = false;
      const byKey = new Map(statTiles.map(t => [t.key, t]));
      const valueOf = (key: string) => Number(byKey.get(key)?.value ?? 0);

      this.incidentStats = STAT_ORDER.map(s => ({
        value: byKey.get(s.key)?.value ?? '0',
        label: s.label,
        ...STAT_CHROME[s.key],
      }));

      // Axis scale can't stay hardcoded to the old mock's range (Total=41)
      // once real totals flow in — rescale to whatever the real "Total" is,
      // rounded up to a clean multiple of 10 (never below 10, so a 0-total
      // response doesn't produce a degenerate 0-height axis).
      const total = valueOf('all');
      const axisMax = Math.max(10, Math.ceil(total / 10) * 10);
      const barMaxHeightPx = 182;
      const barHeight = (count: number) => Math.round((count / axisMax) * barMaxHeightPx);

      this.incidentBars = STAT_ORDER.map(s => ({
        height: barHeight(valueOf(s.key)),
        active: s.key === 'all',
      }));
      this.incidentYLabels = [4, 3, 2, 1, 0].map(n => String(Math.round((axisMax * n) / 4)));
    });
  }

  // Used by the mobile bar chart to scale bars relative to the tallest bar,
  // since that chart has no fixed pixel canvas to size against.
  get incidentBarMax(): number {
    return Math.max(...this.incidentBars.map(b => b.height), 1);
  }

  onExpandCard(): void {
    this.router.navigate(['/incident-management']);
  }
}
