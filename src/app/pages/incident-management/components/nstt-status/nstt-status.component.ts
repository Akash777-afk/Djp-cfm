import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface StatTile {
  key: string;
  label: string;
  value: string;
  bg: string;
  borderColor: string;
  viewText: string;
  icon: string;
}

@Component({
  selector: 'app-nstt-status',
  templateUrl: './nstt-status.component.html',
  styleUrls: ['./nstt-status.component.scss']
})
export class NsttStatusComponent {

  @Input() statTiles: StatTile[] = [];
  @Input() activeKey = '';
  @Output() tileClick = new EventEmitter<string>();
}
