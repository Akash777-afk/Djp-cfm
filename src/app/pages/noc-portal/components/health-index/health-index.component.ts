import { Component } from '@angular/core';
import { ASSET } from '../../noc-portal.constants';

// The 3 charts are the real designer-provided SVG waves (LSI Wave Graph
// asset) rendered as-is via <img>, not a computed/data-bound chart — per
// the brief: "Preserve its appearance". Swap for a live chart library bound
// to real data once the backend exists.
@Component({
  selector: 'app-noc-health-index',
  templateUrl: './health-index.component.html',
  styleUrls: ['./health-index.component.scss']
})
export class NocHealthIndexComponent {
  readonly latencyGraph = `${ASSET}/Group 427319876.svg`;
  readonly bandwidthGraph = `${ASSET}/Group 427319873.svg`;
  readonly trafficGraph = `${ASSET}/traffic.svg`;
  readonly refreshIcon = `${ASSET}/RefreshCw.svg`;
  readonly dropdownIcon = `${ASSET}/Frame 14.svg`;

  onRefresh(): void {
    console.log('LSI Health Index refresh clicked');
  }
}
