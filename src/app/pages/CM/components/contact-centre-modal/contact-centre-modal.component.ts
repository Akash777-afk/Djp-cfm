import { Component, EventEmitter, Input, OnChanges, SimpleChanges, Output } from '@angular/core';
import { Router } from '@angular/router';

// DJP's own ContactCenterComponent has no API call at all — onSearch() just
// opens the legacy NOC Portal in an external, sized/centered popup window
// (window.open(nocPortalUrl + '?lsinumber=...&olmid=...')). Per your
// instruction, this reuses the SAME pattern EM/IM already established in
// DJP-CFM: in-app router navigation to /noc-portal instead of an external
// popup, carrying the LSI number as a query param under DJP's own real
// param name ("lsinumber") even though NOC Portal doesn't consume it yet.
@Component({
  selector: 'app-cm-contact-centre-modal',
  templateUrl: './contact-centre-modal.component.html',
  styleUrls: ['./contact-centre-modal.component.scss']
})
export class ContactCentreModalComponent implements OnChanges {

  constructor(private router: Router) {}

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  lsiNumber = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      this.lsiNumber = '';
    }
  }

  search(): void {
    if (!this.lsiNumber.trim()) { return; }
    this.closed.emit();
    this.router.navigate(['/noc-portal'], { queryParams: { lsinumber: this.lsiNumber.trim() } });
  }

  reset(): void {
    this.lsiNumber = '';
  }

  close(): void {
    this.closed.emit();
  }
}
