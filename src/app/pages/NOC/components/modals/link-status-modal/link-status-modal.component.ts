import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DomainOption {
  key: string;
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-noc-link-status-modal',
  templateUrl: './link-status-modal.component.html',
  styleUrls: ['./link-status-modal.component.scss']
})
export class LinkStatusModalComponent {

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  isRefreshing = false;

  domainOptions: DomainOption[] = [
    { key: 'mpls', label: 'MPLS', checked: false },
    { key: 'bts',  label: 'BTS',  checked: false },
    { key: 'cpe',  label: 'CPE',  checked: false },
  ];

  ipAddress = '';
  pingOption = '';
  miuOption = '';
  commandSelect1 = '';
  commandSelect2 = '';

  readonly pingOptions = ['Ping once', 'Continuous ping', 'Ping with packet size'];
  readonly miuOptions = ['MIU 1', 'MIU 2', 'MIU 3'];

  close(): void {
    this.closed.emit();
  }

  onRefresh(): void {
    this.isRefreshing = true;
    setTimeout(() => { this.isRefreshing = false; }, 700);
  }

  reset(): void {
    this.domainOptions.forEach(d => (d.checked = false));
    this.ipAddress = '';
    this.pingOption = '';
    this.miuOption = '';
  }

  submit(): void {
    console.log('Link Status: submit', {
      domains: this.domainOptions.filter(d => d.checked).map(d => d.key),
      ipAddress: this.ipAddress,
      pingOption: this.pingOption,
      miuOption: this.miuOption,
    });
  }
}
