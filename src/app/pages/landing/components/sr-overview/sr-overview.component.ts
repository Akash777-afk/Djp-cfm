import { Component, Input } from '@angular/core';
import { SectionVariant, SrRow } from '../../landing.types';

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

  onExpandCard(): void {
    console.log('Expand card: sr');
    // TODO: open a full-screen modal / dedicated route for this card
  }
}
