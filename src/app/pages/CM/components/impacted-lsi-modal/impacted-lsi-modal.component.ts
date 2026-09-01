import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ImpactedLsiDetail } from '../types';

export type ImpactedLsiModalMode = 'add' | 'edit';

@Component({
  selector: 'app-cm-impacted-lsi-modal',
  templateUrl: './impacted-lsi-modal.component.html',
  styleUrls: ['./impacted-lsi-modal.component.scss']
})
export class ImpactedLsiModalComponent implements OnChanges {

  @Input() isOpen = false;
  @Input() mode: ImpactedLsiModalMode = 'add';
  @Input() record: ImpactedLsiDetail | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ImpactedLsiDetail>();

  readonly serviceTypeOptions = ['MPLS L3 VPN', 'Internet Leased Line', 'MPLS L2 VPN', 'SD-WAN Managed'];
  readonly statusOptions = ['Active', 'Pending Migration', 'Under Maintenance', 'Newly Provisioned', 'Decommissioned'];

  lsi = '';
  serviceType = '';
  party = '';
  status = '';
  implementer = '';
  remarks = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen) {
      if (this.mode === 'edit' && this.record) {
        this.lsi = this.record.lsi;
        this.serviceType = this.record.serviceType;
        this.party = this.record.party;
        this.status = this.record.status;
        this.implementer = this.record.implementer;
        this.remarks = this.record.remarks;
      } else {
        this.resetForm();
      }
    }
  }

  get isValid(): boolean {
    return !!(this.lsi.trim() && this.serviceType && this.party.trim() && this.status && this.implementer.trim());
  }

  cancel(): void {
    this.closed.emit();
  }

  submit(): void {
    if (!this.isValid) { return; }
    const savedRecord: ImpactedLsiDetail = {
      id: this.mode === 'edit' && this.record ? this.record.id : `ILSI-${Date.now()}`,
      lsi: this.lsi.trim(),
      serviceType: this.serviceType,
      party: this.party.trim(),
      status: this.status,
      implementer: this.implementer.trim(),
      remarks: this.remarks.trim(),
    };
    this.saved.emit(savedRecord);
  }

  private resetForm(): void {
    this.lsi = '';
    this.serviceType = '';
    this.party = '';
    this.status = '';
    this.implementer = '';
    this.remarks = '';
  }
}
