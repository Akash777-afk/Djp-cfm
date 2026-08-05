import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EscalationLevel, SectionVariant } from '../../landing.types';
import { LEVEL_COLORS, LEVEL_COUNTS } from '../../../escalation-matrix/escalation-matrix.constants';

@Component({
  selector: 'app-landing-escalation-matrix',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.scss']
})
export class EscalationMatrixCardComponent {

  constructor(private router: Router) {}

  @Input() variant: SectionVariant = 'desktop';

  // Position within the reorderable 2x2 grid, supplied by LandingComponent.
  @Input() top = 0;
  @Input() left = 0;
  @Input() order = 0;

  escalationCardTitle    = 'Escalation matrix';
  escalationCardSubtitle = 'Streamline issue escalation with clear ownership and workflows.';

  // Counts and colors come from the escalation matrix page's own constants,
  // so this card can never disagree with the real page on the numbers.
  private readonly totalEscalatedCount = Object.values(LEVEL_COUNTS).reduce((sum, count) => sum + count, 0);
  totalEscalated = String(this.totalEscalatedCount);

  escalationLevels: EscalationLevel[] = [1, 2, 3, 4, 5, 6].map(level => {
    const count = LEVEL_COUNTS[level];
    return {
      label: `Level ${level}`,
      dotColor: LEVEL_COLORS[level],
      count,
      percent: count === 0 ? '—' : `${((count / this.totalEscalatedCount) * 100).toFixed(1)}%`,
      isLast: level === 6,
    };
  });

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
