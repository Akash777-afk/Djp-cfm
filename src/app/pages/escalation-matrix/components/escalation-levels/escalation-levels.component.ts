import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface EscalationLevelTile {
  key: string;          // 'all' | 'level-1' ... 'level-6'
  label: string;        // 'Counts' | 'Level 1' ...
  value: number;
  accent: string;       // border / icon-box / dot color
  bg: string;           // tinted card background
  icon: string;         // path to the tile's icon image (/assets/...)
  filledDots: number;   // 0 for the 'all' tile (shows pillText instead), else 1-6
  pillText?: string;    // only set on the 'all' tile: 'All Escalated SRs'
}

@Component({
  selector: 'app-escalation-levels',
  templateUrl: './escalation-levels.component.html',
  styleUrls: ['./escalation-levels.component.scss']
})
export class EscalationLevelsComponent {

  @Input() tiles: EscalationLevelTile[] = [];
  @Input() activeKey = 'all';
  @Output() refreshClick = new EventEmitter<void>();
  @Output() tileClick = new EventEmitter<string>();

  // Fixed 6-slot dot track shared by every tile — only the filled count differs.
  readonly dotSlots = [0, 1, 2, 3, 4, 5];
}
