import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cm-contact-centre-modal',
  templateUrl: './contact-centre-modal.component.html',
  styleUrls: ['./contact-centre-modal.component.scss']
})
export class ContactCentreModalComponent implements OnChanges {

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  lsiNumber = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.lsiNumber = '';
    }
  }

  search(): void {
    console.log('Contact centre directory search clicked');
    // TODO: wire up once the contact directory lookup is built
  }

  reset(): void {
    this.lsiNumber = '';
  }

  close(): void {
    this.closed.emit();
  }
}
