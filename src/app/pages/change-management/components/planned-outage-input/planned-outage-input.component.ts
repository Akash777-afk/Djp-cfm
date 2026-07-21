import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PlannedOutage } from '../crq-planned-outages/crq-planned-outages.component';

export type DetailTab = 'plannedOutage' | 'additionalDetails' | 'outageCommunications';

interface DetailTabDef {
  key: DetailTab;
  label: string;
  left: number;
  width: number;
}

@Component({
  selector: 'app-planned-outage-input',
  templateUrl: './planned-outage-input.component.html',
  styleUrls: ['./planned-outage-input.component.scss']
})
export class PlannedOutageInputComponent {

  @Input() selectedOutage: PlannedOutage | null = null;
  @Input() activeDetailTab: DetailTab = 'plannedOutage';
  @Output() activeDetailTabChange = new EventEmitter<DetailTab>();

  @Output() assigneeClick = new EventEmitter<void>();
  @Output() notifyClick = new EventEmitter<void>();
  @Output() moreOptionsClick = new EventEmitter<void>();

  // ---------- Sliding tab indicator ----------
  readonly tabs: DetailTabDef[] = [
    { key: 'plannedOutage', label: 'Planned outage', left: 0, width: 223 },
    { key: 'additionalDetails', label: 'Additional Details', left: 227, width: 264 },
    { key: 'outageCommunications', label: 'Outage Communications', left: 495, width: 323 },
  ];

  get activeTab(): DetailTabDef {
    return this.tabs.find(t => t.key === this.activeDetailTab) ?? this.tabs[0];
  }

  setDetailTab(tab: DetailTab): void {
    this.activeDetailTabChange.emit(tab);
  }

  // ---------- Fields with no home in the PlannedOutage model (mocked in the design) ----------
  benefitOfChange = 'To provide better services uptime in future';
  durationInMin = '60 minutes';
  changeTypeCategory = 'Customer';
  category = 'Planned';
  activityLocation = 'Hyderabad';
  private creationDateValue = '2026.03.11 - 10:42:59';

  readonly changeTypeOptions = ['Link shifting', 'Configuration change', 'Hardware replacement', 'Software upgrade'];
  readonly benefitOptions = ['To provide better services uptime in future', 'Reduce network latency', 'Improve redundancy', 'Regulatory compliance'];
  readonly categoryOptions = ['Planned', 'Emergency', 'Standard'];
  readonly impactOptions = ['Service affecting', 'Non-service affecting', 'No impact'];
  readonly statusOptions = ['Planned', 'Submitted', 'In Progress', 'Completed', 'Cancelled'];

  // ---------- "YYYY.MM.DD - HH:mm:ss" <-> <input type="datetime-local"> value conversion ----------
  private toDatetimeLocal(value: string): string {
    const match = value.match(/(\d{4})\.(\d{2})\.(\d{2})\s*-\s*(\d{2}):(\d{2})/);
    if (!match) return '';
    const [, y, m, d, h, min] = match;
    return `${y}-${m}-${d}T${h}:${min}`;
  }

  private fromDatetimeLocal(value: string): string {
    if (!value) return '';
    const [datePart, timePart] = value.split('T');
    const [y, m, d] = datePart.split('-');
    return `${y}.${m}.${d} - ${timePart}:00`;
  }

  get startDateInput(): string {
    return this.selectedOutage ? this.toDatetimeLocal(this.selectedOutage.startDate) : '';
  }
  set startDateInput(value: string) {
    if (this.selectedOutage) this.selectedOutage.startDate = this.fromDatetimeLocal(value);
  }

  get endDateInput(): string {
    return this.selectedOutage ? this.toDatetimeLocal(this.selectedOutage.endDate) : '';
  }
  set endDateInput(value: string) {
    if (this.selectedOutage) this.selectedOutage.endDate = this.fromDatetimeLocal(value);
  }

  get creationDateInput(): string {
    return this.toDatetimeLocal(this.creationDateValue);
  }
  set creationDateInput(value: string) {
    this.creationDateValue = this.fromDatetimeLocal(value);
  }
}
