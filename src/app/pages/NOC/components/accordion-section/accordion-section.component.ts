import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-noc-accordion-section',
  templateUrl: './accordion-section.component.html',
  styleUrls: ['./accordion-section.component.scss']
})
export class AccordionSectionComponent {

  @Input() title = '';
  @Input() expanded = false;
  @Output() expandedChange = new EventEmitter<boolean>();

  toggle(): void {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }
}
