import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StatCard } from '../../change-management-landing.types';

@Component({
  selector: 'app-cml-stat-cards',
  templateUrl: './stat-cards.component.html',
  styleUrls: ['./stat-cards.component.scss']
})
export class ChangeManagementLandingStatCardsComponent {
  @Input() cards: StatCard[] = [];

  // Emits the clicked card's key; the parent owns which single card is active.
  @Output() cardClick = new EventEmitter<string>();
}
