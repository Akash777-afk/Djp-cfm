import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { PlannedOutage } from '../types';
import { ChangeManagementService } from '../../services/change-management.service';

type ModalStep = 'crq' | 'form' | 'success';

@Component({
  selector: 'app-cm-create-po-modal',
  templateUrl: './create-po-modal.component.html',
  styleUrls: ['./create-po-modal.component.scss']
})
export class CreatePoModalComponent implements OnInit, OnChanges {

  constructor(private cmService: ChangeManagementService) {}

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() poCreated = new EventEmitter<PlannedOutage>();

  step: ModalStep = 'crq';
  crqNumber = '';

  // Real CRQ validation (API #3) — DJP's own convention is inverted-sounding
  // (isCRQValid=true actually means "not found", gating the form to stay
  // hidden — see change-management.service.ts's note on this). Kept as a
  // straightforward boolean here instead of reproducing that naming.
  isValidatingCrq = false;
  crqNotFound = false;

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

  isSubmitting = false;
  submitError = '';

  // Dropdown options start with the same plausible defaults the design
  // always had (instant usability), replaced with real/mock data (API #4)
  // once it resolves — see planned-outage-input's identical approach.
  changeTypeOptions = ['Link shifting', 'Configuration change', 'Hardware replacement', 'Software upgrade'];
  outageReasonOptions = ['Maintenance', 'Upgrade', 'Capacity expansion', 'Fault rectification'];
  impactOptions = ['Service affecting', 'Non-service affecting', 'No impact'];
  categoryOptions = ['Planned', 'Emergency', 'Standard'];
  activityLocationOptions = ['Hyderabad', 'Bengaluru', 'Chennai', 'Mumbai', 'Delhi'];
  benefitOptions = ['To provide better services uptime in future', 'Reduce network latency', 'Improve redundancy', 'Regulatory compliance'];
  typeOfChangeOptions = ['Customer', 'Internal', 'Vendor'];

  ngOnInit(): void {
    // DJP calls getDropdownValues for CategoryList/ChangeType/Impact/
    // TypeOfChange (4 of the 7 dropdowns here) — OutageReason,
    // ActivityLocation and BenefitOfChange have no DJP dropdown-name
    // equivalent found anywhere in source, so they keep their static
    // design-mock options rather than guessing an API name for them.
    this.cmService.getDropdownValues('ChangeType').subscribe(opts => { if (opts?.length) { this.changeTypeOptions = opts; } });
    this.cmService.getDropdownValues('Impact').subscribe(opts => { if (opts?.length) { this.impactOptions = opts; } });
    this.cmService.getDropdownValues('CategoryList').subscribe(opts => { if (opts?.length) { this.categoryOptions = opts; } });
    this.cmService.getDropdownValues('TypeOfChange').subscribe(opts => { if (opts?.length) { this.typeOfChangeOptions = opts; } });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reopening should always start from a clean step 1, not wherever the
    // previous attempt left off.
    if (changes['isOpen'] && this.isOpen) {
      this.resetForm();
    }
  }

  goToForm(): void {
    if (!this.crqNumber.trim()) { return; }
    this.isValidatingCrq = true;
    this.crqNotFound = false;
    this.cmService.validateCrq(this.crqNumber.trim()).subscribe(({ valid }) => {
      this.isValidatingCrq = false;
      // DJP's own inverted logic: a *found* CRQ (valid array data) means
      // the form should NOT proceed as a fresh submission for it — but
      // DJP's actual gate was on the presence of data at all, used only to
      // flip a "showForm" flag; here, any query result (found or not) still
      // lets the user continue to the form, matching the practical UI flow
      // (CreatePoComponent's showForm ends up true either way once
      // validateCRQ resolves — false only transiently). Flagging that this
      // exact gate condition is genuinely ambiguous from source rather than
      // guessing further; proceeding to the form in both cases.
      this.step = 'form';
    });
  }

  cancel(): void {
    this.closed.emit();
  }

  submit(): void {
    this.isSubmitting = true;
    this.submitError = '';
    const fields = {
      'Activity Location': this.activityLocation,
      'Benefit Of Change': this.benefitOfChange,
      Category: this.category,
      'Change Description': this.description,
      'Change Type': this.changeType,
      Impact: this.impact,
      Implementer: this.implementerEmail,
      'Request CRQ': this.crqNumber || '',
      'Duration in Min': this.durationInMin,
      'Outage Reason': this.outageReason,
      'Planned End Date': this.formatDate(this.endDateInput),
      'Planned Start Date': this.formatDate(this.startDateInput),
      'Requester Email Id': this.requesterEmail,
      'Type of Change': this.typeOfChange,
      'Reference Number': this.referenceNumber,
    };
    const payload = this.cmService.buildSyncPoPayload(fields);

    // syncPlannedOutage has no catchError/mock fallback (a write shouldn't
    // silently fake success) — both next AND error must be handled here, or
    // a real backend failure (e.g. this dev environment's 20s timeout)
    // leaves isSubmitting stuck true with no feedback at all.
    this.cmService.syncPlannedOutage(payload).subscribe({
      next: data => {
        this.isSubmitting = false;
        // Verified success convention: StatusMessage === 'Success'.
        if (data && data.StatusMessage === 'Success') {
          const poId = data?.SiebelMessage?.['B2B Planned Outage BC']?.['Planned Outage Id'] || this.crqNumber;
          // Fire-and-forget internal save (API #7) — DJP never reads this
          // response either; not treated as part of the create's own
          // success/failure.
          this.cmService.savePoInternal({ ...fields, 'Planned Outage Id': poId }).subscribe();

          const newOutage: PlannedOutage = {
            outageId: poId,
            crq: this.crqNumber,
            changeType: this.changeType,
            impact: this.impact,
            status: this.category || 'Planned',
            implementer: this.implementerEmail,
            description: this.description,
            startDate: this.formatDate(this.startDateInput),
            endDate: this.formatDate(this.endDateInput),
            reason: this.outageReason,
            submission: 'Submitted',
          };
          this.poCreated.emit(newOutage);
          this.step = 'success';
        } else {
          this.submitError = data?.StatusMessage || 'Something went wrong, please try again';
        }
      },
      error: err => {
        this.isSubmitting = false;
        console.error('[CreatePoModal] syncPlannedOutage failed:', err);
        this.submitError = 'Unable to reach the server, please try again';
      },
    });
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
    this.isValidatingCrq = false;
    this.crqNotFound = false;
    this.isSubmitting = false;
    this.submitError = '';
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
