import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface StatTile {
  label: string;
  value: string;
  badge: string;
  badgeExtra: string;
  bg: string;
  borderColor: string;
  textColor: string;
  badgeBorderColor: string;
  valueLeft: number;
  badgeWidth: number;
  icon: string;
  badgeIcon: string;
}

@Component({
  selector: 'app-nstt-status',
  templateUrl: './nstt-status.component.html',
  styleUrls: ['./nstt-status.component.scss']
})
export class NsttStatusComponent {

  @Input() statTiles: StatTile[] = [];
  @Output() refreshClick = new EventEmitter<void>();
}
