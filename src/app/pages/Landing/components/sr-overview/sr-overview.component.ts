import { Component, Input } from '@angular/core';
import { SectionVariant, SrRow } from '../../landing.types';
import { LEVEL_COLORS, levelColorRgba } from '../../../escalation-matrix/escalation-matrix.constants';

@Component({
  selector: 'app-sr-overview',
  templateUrl: './sr-overview.component.html',
  styleUrls: ['./sr-overview.component.scss']
})
export class SrOverviewComponent {

  @Input() variant: SectionVariant = 'desktop';

  // Position within the reorderable 2x2 grid, supplied by LandingComponent.
  @Input() top = 0;
  @Input() left = 0;
  @Input() order = 0;

  srCardTitle    = 'SR overview';
  srCardSubtitle = 'Manage service requests from submission to resolution.';

  srRows: SrRow[] = [
    { srNumber: 'SR-35870455', riseDate: '07/20/2024', summary: 'Link Down',     subType: 'Parent', level: 2, trackingPercent: 15, isLast: false },
    { srNumber: 'SR-35870455', riseDate: '07/20/2024', summary: 'Link Flapping', subType: 'Child',  level: 3, trackingPercent: 30, isLast: false },
    { srNumber: 'SR-35870455', riseDate: '07/20/2024', summary: 'Link Flapping', subType: 'Parent', level: 4, trackingPercent: 55, isLast: false },
    { srNumber: 'SR-35870455', riseDate: '07/20/2024', summary: 'Link Down',     subType: 'Parent', level: 5, trackingPercent: 68, isLast: true  },
  ];

  // Escalation Level badge/dot/tracking-bar colors all derive from the
  // escalation matrix's LEVEL_COLORS, so this card can never disagree with
  // the Escalation Matrix page/card on what color a level is.
  levelColor(level: number): string {
    return LEVEL_COLORS[level] ?? '#94a3b8';
  }
  levelBg(level: number): string {
    return levelColorRgba(level, 0.15);
  }
  levelBorder(level: number): string {
    return levelColorRgba(level, 0.4);
  }

  onExpandCard(): void {
    console.log('Expand card: sr');
    // TODO: open a full-screen modal / dedicated route for this card
  }
}
