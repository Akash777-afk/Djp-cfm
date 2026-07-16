import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent {

  @Input() pageTitle = '';
  @Input() searchPlaceholder = '';
  @Input() lastUpdated = '';

  @Input() searchQuery = '';
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();

  @Output() menuClick = new EventEmitter<void>();
  @Output() refreshClick = new EventEmitter<void>();
}
