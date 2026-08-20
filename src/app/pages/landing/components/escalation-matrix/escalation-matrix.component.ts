import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EscalationLevel, SectionVariant } from '../../landing.types';
import { LEVEL_COLORS } from '../../../escalation-matrix/escalation-matrix.constants';
import { EscalationMatrixService } from '../../../escalation-matrix/services/escalation-matrix.service';

@Component({
  selector: 'app-landing-escalation-matrix',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.scss']
})
export class EscalationMatrixCardComponent implements OnInit {

  constructor(
    private router: Router,
    private emService: EscalationMatrixService,
  ) {}

  @Input() variant: SectionVariant = 'desktop';

  // Position within the reorderable 2x2 grid, supplied by LandingComponent.
  @Input() top = 0;
  @Input() left = 0;
  @Input() order = 0;

  escalationCardTitle    = 'Escalation matrix';
  escalationCardSubtitle = 'Streamline issue escalation with clear ownership and workflows.';

  // Populated from EscalationMatrixService.getDashboardData() in ngOnInit()
  // below — the same real API (with the same real+mock-fallback behavior)
  // the actual Escalation Matrix page itself calls. Colors come from the
  // shared LEVEL_COLORS palette (page chrome, not something any API
  // returns) so this card can never show a level in a different color than
  // the real page. Initialized to an all-zero 6-level placeholder so the
  // card's layout is already correct during the brief loading window.
  totalEscalated = '0';
  escalationLevels: EscalationLevel[] = [1, 2, 3, 4, 5, 6].map(level => ({
    label: `Level ${level}`,
    dotColor: LEVEL_COLORS[level],
    count: 0,
    percent: '—',
    isLast: level === 6,
  }));

  // Drives app-card-loading-overlay — true for exactly as long as
  // getDashboardData()'s call is in flight, tied to the real Observable
  // lifecycle (not a timeout). See the identical note on
  // IncidentManagementCardComponent.isLoading for why no separate
  // "now show mock" step is needed here.
  isLoading = true;

  ngOnInit(): void {
    this.emService.getDashboardData().subscribe(({ levelTiles }) => {
      this.isLoading = false;
      const byKey = new Map(levelTiles.map(t => [t.key, t]));
      const total = byKey.get('all')?.value ?? 0;
      this.totalEscalated = String(total);

      this.escalationLevels = [1, 2, 3, 4, 5, 6].map(level => {
        const count = byKey.get(`level-${level}`)?.value ?? 0;
        return {
          label: `Level ${level}`,
          dotColor: LEVEL_COLORS[level],
          count,
          percent: total === 0 ? '—' : `${((count / total) * 100).toFixed(1)}%`,
          isLast: level === 6,
        };
      });
    });
  }

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

  onExpandCard(): void {
    this.router.navigate(['/escalation-matrix']);
  }
}
