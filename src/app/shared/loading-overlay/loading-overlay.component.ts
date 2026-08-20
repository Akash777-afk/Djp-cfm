import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

// Single global instance, mounted once at the app root (see
// app.component.html) — not per-page. Every module (Incident Management,
// Escalation Matrix, Change Management, and any future one) shares this
// same overlay by injecting LoadingService and calling show()/hide()
// alongside its own existing isLoading flag, rather than each page
// rendering its own inline loading indicator.
@Component({
  selector: 'app-loading-overlay',
  templateUrl: './loading-overlay.component.html',
  styleUrls: ['./loading-overlay.component.scss'],
})
export class LoadingOverlayComponent {
  readonly visible$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.visible$ = this.loadingService.visible$;
  }
}
