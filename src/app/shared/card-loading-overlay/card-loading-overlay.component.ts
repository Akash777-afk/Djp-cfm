import { Component, Input } from '@angular/core';

// Card-scoped sibling of app-loading-overlay (shared/loading-overlay) — same
// Airtel-branded visual language (blurred/dimmed background, red circular
// spinner, cropped swirl logo), but position:absolute instead of fixed, so
// it fills whichever card it's placed inside (that card's own root element
// is already position:absolute/relative — see incident-management /
// escalation-matrix / change-management landing card stylesheets) rather
// than the whole viewport. Deliberately a separate component rather than a
// "fullScreen" toggle on the global one: the two have different positioning
// models, different stacking concerns (this never needs to sit above an
// app-wide modal), and are used independently — one instance per card, not
// a single shared/counted instance like LoadingService.
@Component({
  selector: 'app-card-loading-overlay',
  templateUrl: './card-loading-overlay.component.html',
  styleUrls: ['./card-loading-overlay.component.scss'],
})
export class CardLoadingOverlayComponent {
  @Input() loading = false;
}
