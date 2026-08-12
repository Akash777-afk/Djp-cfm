import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-noc-topology-modal',
  templateUrl: './topology-modal.component.html',
  styleUrls: ['./topology-modal.component.scss']
})
export class TopologyModalComponent {

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  isRefreshing = false;
  zoom = 1;

  // The diagram itself (device photos, custom node positions/connections)
  // is a single reference image rather than a decomposed interactive graph
  // — same convention this app already uses for the LSI Health Index charts
  // (see health-index.component.html's .nhi-chart-img), which are also
  // pre-rendered images, not a real charting engine. There's no graphing
  // library or node/edge data model anywhere else in this codebase to
  // extend, and no device-photo assets to rebuild the diagram from parts.
  readonly diagramImage = '/assets/NOC_Portal/TOPpol.png';

  readonly rjnOptions = ['RJN-2201', 'RJN-2202', 'RJN-2203'];
  rjnNumber = '';

  close(): void {
    this.closed.emit();
  }

  onRefresh(): void {
    this.isRefreshing = true;
    setTimeout(() => { this.isRefreshing = false; }, 700);
  }

  zoomIn(): void {
    this.zoom = Math.min(2, +(this.zoom + 0.15).toFixed(2));
  }

  zoomOut(): void {
    this.zoom = Math.max(0.5, +(this.zoom - 0.15).toFixed(2));
  }
}
