import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cm-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class ChangeManagementHeaderBarComponent {

  // Matches the host page's --djp-scale so the header (deliberately
  // position:fixed, outside the scaled canvas, to survive scrolling) still
  // shrinks in sync with the rest of the page below 1920px viewports instead
  // of staying full-size and drifting out of place.
  @Input() scale = 1;
}
