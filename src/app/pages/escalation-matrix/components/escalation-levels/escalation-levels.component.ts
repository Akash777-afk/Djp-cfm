import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface EscalationLevelTile {
  key: string;          // 'all' | 'level-1' ... 'level-6'
  label: string;        // 'Count' | 'Level 1' ...
  value: number;
  accent: string;       // border / icon-badge / title color
  bg: string;            // tinted icon-badge background
  icon: string;          // path to the tile's icon image (/assets/...)
  filledDots: number;    // unused by this card design, kept for interface stability
  pillText?: string;     // unused by this card design, kept for interface stability
}

@Component({
  selector: 'app-escalation-levels',
  templateUrl: './escalation-levels.component.html',
  styleUrls: ['./escalation-levels.component.scss']
})
export class EscalationLevelsComponent {

  @Input() tiles: EscalationLevelTile[] = [];
  @Input() activeKey = 'all';
  @Output() tileClick = new EventEmitter<string>();

  // Count card ('all'): "View total count" (all-lowercase, matching CM's
  // "View X" convention). Level cards: "View Level N SRs" — keeps "Level N"
  // capitalized as-is and appends "SRs", a different format than the Count
  // card's, per the explicit per-tile-type wording requested.
  viewText(tile: EscalationLevelTile): string {
    if (tile.key === 'all') { return `View ${tile.label.toLowerCase()}`; }
    return `View ${tile.label} SRs`;
  }
}
