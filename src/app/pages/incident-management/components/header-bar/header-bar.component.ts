import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-im-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class IncidentManagementHeaderBarComponent {

  // Matches the host page's --djp-scale so the header (deliberately
  // position:fixed, outside the scaled canvas, to survive scrolling) still
  // shrinks in sync with the rest of the page below 1920px viewports instead
  // of staying full-size and drifting out of place.
  @Input() scale = 1;

  // Breadcrumb content is page-specific. Existing pages each have a
  // pre-rendered image for it; pages without one (no design export exists
  // yet) can pass breadcrumbText instead to render a live text label in the
  // same visual style — this header is shared across pages beyond
  // incident-management.
  @Input() breadcrumbImage = '/assets/incident-management/Breadcrumb-incedentm.png';
  @Input() breadcrumbAlt = 'Incident Management';
  @Input() breadcrumbText: string | null = null;
}
