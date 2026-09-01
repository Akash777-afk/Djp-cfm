import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-cml-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class ChangeManagementLandingTopBarComponent {

  @Input() userName = '';

  @Output() callClick = new EventEmitter<void>();
  @Output() bookClick = new EventEmitter<void>();
}
