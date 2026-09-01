import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NsttRow } from '../all-nstts/all-nstts.component';

// Expand-to-child-SRs view for one NSTT row. DJP itself has no inline row
// expansion — clicking an NSTT there navigates to a whole separate page
// (dashboard/imSrList). Building a real second page wasn't warranted for
// what's fundamentally the same data already delivered by the NSTT list
// response ("SR details for each NSTT"), so this reuses the app's existing
// overlay-modal pattern (see noc-portal's topology-modal) instead — same
// visual language, zero risk to the main table's fixed-pixel column layout.
@Component({
  selector: 'app-nstt-sr-drawer',
  templateUrl: './nstt-sr-drawer.component.html',
  styleUrls: ['./nstt-sr-drawer.component.scss']
})
export class NsttSrDrawerComponent {

  @Input() row: NsttRow | null = null;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }
}
