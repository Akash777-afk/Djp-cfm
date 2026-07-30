import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cm-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss']
})
export class ChangeManagementSidebarNavComponent {

  constructor(private router: Router) {}

  // Matches the host page's --djp-scale/--cml-scale so the sidebar (deliberately
  // position:fixed, outside the scaled canvas, to survive scrolling) still
  // shrinks in sync with the rest of the page below 1920px viewports instead
  // of staying full-size and drifting out of place.
  @Input() scale = 1;

  @Output() createPoClick = new EventEmitter<void>();
  @Output() serviceImpactClick = new EventEmitter<void>();
  @Output() contactCentreClick = new EventEmitter<void>();

  goToDashboard(): void {
    this.router.navigate(['/']);
  }

  onLsiSearch(): void {
    console.log('LSI Search clicked');
    // TODO: wire up once the LSI Search destination is defined
  }

  onCreatePoClick(): void {
    this.createPoClick.emit();
  }

  onServiceImpactClick(): void {
    this.serviceImpactClick.emit();
  }

  onContactCentreClick(): void {
    this.contactCentreClick.emit();
  }
}
