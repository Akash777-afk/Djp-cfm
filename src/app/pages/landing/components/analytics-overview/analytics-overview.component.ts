import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NavTab, SectionVariant } from '../../landing.types';

@Component({
  selector: 'app-analytics-overview',
  templateUrl: './analytics-overview.component.html',
  styleUrls: ['./analytics-overview.component.scss']
})
export class AnalyticsOverviewComponent {

  @Input() variant: SectionVariant = 'desktop';

  analyticsTitle    = 'Analytics Overview';
  analyticsSubtitle = 'Real-time insights and performance metrics';

  // Active-tab state lives in LandingComponent (it drives the 2x2 grid card
  // reordering shared by 4 sibling components) and is passed down so both
  // the desktop and mobile instances of this component stay in sync.
  @Input() navTabs: NavTab[] = [];
  @Output() tabSelect = new EventEmitter<NavTab>();

  @Input() activeInterface: 'classic' | 'enhanced' = 'enhanced';
  @Output() interfaceSelect = new EventEmitter<'classic' | 'enhanced'>();
}
