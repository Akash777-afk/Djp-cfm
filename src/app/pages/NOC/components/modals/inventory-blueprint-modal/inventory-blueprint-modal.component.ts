import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface BlueprintField {
  label: string;
  value: string;
}

export interface BlueprintSection {
  key: string;
  title: string;
  fields: BlueprintField[];
}

@Component({
  selector: 'app-noc-inventory-blueprint-modal',
  templateUrl: './inventory-blueprint-modal.component.html',
  styleUrls: ['./inventory-blueprint-modal.component.scss']
})
export class InventoryBlueprintModalComponent {

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  isRefreshing = false;

  // Mock data matching the reference exactly — including "Mobility circle
  // BTS ID" appearing twice under Last Mile (once with a real value, once
  // "No results found"). That looks like a duplicate in the source design,
  // but it's kept verbatim rather than guessed at.
  readonly sections: BlueprintSection[] = [
    {
      key: 'transport', title: 'Transport',
      fields: [
        { label: 'MPLS PE', value: 'JRR-MPL-LTE-PE-RTR-43-14' },
        { label: 'MPLS Sub Interface', value: 'Bundle-Ether-3.7631' },
        { label: 'CEN host name', value: 'No results found' },
        { label: 'CEN Interface name', value: 'No results found' },
      ],
    },
    {
      key: 'last-mile', title: 'Last Mile',
      fields: [
        { label: 'Mobility circle BTS ID', value: 'RJ-JA1287' },
        { label: 'LM device IP', value: '10.10.67.226' },
        { label: 'CPE Management IP', value: '10.10.67.230' },
        { label: 'OLT NE', value: 'No results found' },
        { label: 'OLT IP address', value: 'No results found' },
        { label: 'Mobility circle BTS ID', value: 'No results found' },
      ],
    },
    {
      key: 'elan', title: 'ELAN details',
      fields: [
        { label: 'ELAN name', value: 'ELAN MWRKT-ML3-15-68937' },
        { label: 'MPLS service ID', value: 'MWRKT-ML3-15-68937' },
        { label: 'CEN service ID', value: 'TEMD-ANG02764' },
        { label: 'PTN service ID', value: 'TEMD-T202764' },
        { label: 'OTN service ID', value: 'N/A' },
        { label: 'Thirdparty service ID', value: 'N/A' },
      ],
    },
    {
      key: 'technical', title: 'Technical details',
      fields: [
        { label: 'WAN IPCE', value: '172.32.41.1' },
        { label: 'BTS Node ID', value: 'NGRT02' },
        { label: 'IWAN circle', value: 'HP' },
        { label: 'RF circuit ID', value: 'P2MP' },
        { label: 'Existing BHRA number', value: '27291891' },
        { label: 'CE make & model', value: 'Cambium' },
      ],
    },
  ];

  close(): void {
    this.closed.emit();
  }

  onRefresh(): void {
    this.isRefreshing = true;
    setTimeout(() => { this.isRefreshing = false; }, 700);
  }
}
