import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PlannedOutage } from '../types';

type ModalStep = 'crq' | 'form' | 'success';

@Component({
  selector: 'app-cm-create-po-modal',
  templateUrl: './create-po-modal.component.html',
  styleUrls: ['./create-po-modal.component.scss']
})
export class CreatePoModalComponent implements OnChanges {

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() poCreated = new EventEmitter<PlannedOutage>();

  step: ModalStep = 'crq';
  crqNumber = '';

  // ---------- Step 2 form fields — a blank create form starts fully empty ----------
  changeType = '';
  requesterEmail = '';
  description = '';
  outageReason = '';
  referenceNumber = '';
  durationInMin = '';
  impact = '';
  category = '';
  activityLocation = '';
  benefitOfChange = '';
  implementerEmail = '';
  typeOfChange = '';
  startDateInput = '';
  endDateInput = '';

  readonly changeTypeOptions = ['Link shifting', 'Configuration change', 'Hardware replacement', 'Software upgrade'];
  readonly outageReasonOptions = ['Maintenance', 'Upgrade', 'Capacity expansion', 'Fault rectification'];
  readonly impactOptions = ['Service affecting', 'Non-service affecting', 'No impact'];
  readonly categoryOptions = ['Planned', 'Emergency', 'Standard'];
  readonly activityLocationOptions = ['Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai', 'Delhi'];
  readonly benefitOptions = ['To provide better services uptime in future', 'Reduce network latency', 'Improve redundancy', 'Regulatory compliance'];
  readonly typeOfChangeOptions = ['Customer', 'Internal', 'Vendor'];

  ngOnChanges(changes: SimpleChanges): void {
    // Reopening should always start from a clean step 1, not wherever the
    // previous attempt left off.
    if (changes['isOpen'] && this.isOpen) {
      this.resetForm();
    }
  }

  goToForm(): void {
    if (!this.crqNumber.trim()) { return; }
    this.step = 'form';
  }

  cancel(): void {
    this.closed.emit();
  }

  submit(): void {
    const newOutage: PlannedOutage = {
      outageId: this.crqNumber,
      crq: this.crqNumber,
      changeType: this.changeType,
      impact: this.impact,
      status: this.category || 'Planned',
      implementer: this.implementerEmail,
      description: this.description,
      startDate: this.formatDate(this.startDateInput),
      endDate: this.formatDate(this.endDateInput),
      reason: this.outageReason,
      submission: 'Submitted'
    };
    this.poCreated.emit(newOutage);
    this.step = 'success';
  }

  done(): void {
    this.closed.emit();
  }

  // "YYYY-MM-DDTHH:mm" (datetime-local) -> "YYYY.MM.DD - HH:mm:00", matching
  // the format already used throughout the rest of the planned-outages table.
  private formatDate(value: string): string {
    if (!value) { return 'N/A'; }
    const [datePart, timePart] = value.split('T');
    const [y, m, d] = datePart.split('-');
    return `${y}.${m}.${d} - ${timePart}:00`;
  }

  private resetForm(): void {
    this.step = 'crq';
    this.crqNumber = '';
    this.changeType = '';
    this.requesterEmail = '';
    this.description = '';
    this.outageReason = '';
    this.referenceNumber = '';
    this.durationInMin = '';
    this.impact = '';
    this.category = '';
    this.activityLocation = '';
    this.benefitOfChange = '';
    this.implementerEmail = '';
    this.typeOfChange = '';
    this.startDateInput = '';
    this.endDateInput = '';
  }
}
