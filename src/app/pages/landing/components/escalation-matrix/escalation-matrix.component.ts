import { Component, Input } from '@angular/core';
import { EscalationLevel, SectionVariant } from '../../landing.types';

@Component({
  selector: 'app-landing-escalation-matrix',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.scss']
})
export class EscalationMatrixCardComponent {

  @Input() variant: SectionVariant = 'desktop';

  // Position within the reorderable 2x2 grid, supplied by LandingComponent.
  @Input() top = 0;
  @Input() left = 0;
  @Input() order = 0;

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

  onExpandCard(): void {
    console.log('Expand card: escalation');
    // TODO: open a full-screen modal / dedicated route for this card
  }
}
