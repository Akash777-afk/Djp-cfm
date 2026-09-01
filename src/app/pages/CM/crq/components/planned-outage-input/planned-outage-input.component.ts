import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ImpactedLsiDetail, PlannedOutage } from '../../../components/types';
import { ChangeManagementService } from '../../../services/change-management.service';

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
export class PlannedOutageInputComponent implements OnInit, OnChanges {

  constructor(private cmService: ChangeManagementService) {}

  @Input() selectedOutage: PlannedOutage | null = null;
  @Input() activeDetailTab: DetailTab = 'plannedOutage';
  @Output() activeDetailTabChange = new EventEmitter<DetailTab>();

  @Output() assigneeClick = new EventEmitter<void>();
  @Output() notifyClick = new EventEmitter<void>();
  @Output() moreOptionsClick = new EventEmitter<void>();

  // Save/Notify feedback — parent owns the actual API calls (this component
  // has no service dependency for writes, same convention as EM/IM's
  // presentational table components).
  @Input() isSaving = false;
  @Input() saveMessage: { type: 'success' | 'error'; text: string } | null = null;
  @Input() isNotifying = false;
  @Input() notifyMessage: { type: 'success' | 'error'; text: string } | null = null;

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

  // Dropdown options — start with the same plausible defaults the design
  // always had (so the form is usable instantly), replaced with real data
  // (API #4, ×4) once it resolves. Real API is unreachable in this dev
  // environment, so in practice these get replaced by the *mock* fallback
  // built into ChangeManagementService.getDropdownValues() — same
  // stale-while-revalidate approach used for every dropdown in this pass.
  changeTypeOptions = ['Link shifting', 'Configuration change', 'Hardware replacement', 'Software upgrade'];
  benefitOptions = ['To provide better services uptime in future', 'Reduce network latency', 'Improve redundancy', 'Regulatory compliance'];
  categoryOptions = ['Planned', 'Emergency', 'Standard'];
  impactOptions = ['Service affecting', 'Non-service affecting', 'No impact'];
  // Status has no DJP dropdown-name equivalent confirmed beyond the generic
  // getDropdownValues('Status') call SearchCrqPoComponent makes for its own
  // filter row — reused here for this field too since it's the same concept.
  statusOptions = ['Planned', 'Submitted', 'In Progress', 'Completed', 'Cancelled'];

  ngOnInit(): void {
    this.cmService.getDropdownValues('ChangeType').subscribe(opts => { if (opts?.length) { this.changeTypeOptions = opts; } });
    this.cmService.getDropdownValues('CategoryList').subscribe(opts => { if (opts?.length) { this.categoryOptions = opts; } });
    this.cmService.getDropdownValues('Impact').subscribe(opts => { if (opts?.length) { this.impactOptions = opts; } });
    this.cmService.getDropdownValues('Status').subscribe(opts => { if (opts?.length) { this.statusOptions = opts; } });
  }

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

  // ---------- Link Status (API #10) ----------
  // DJP's own check is single-LSI and on-demand (SearchCrqPoComponent.
  // getLinkStatus(lsi)), not a bulk/automatic per-row table thing — this
  // mirrors that exactly: one small button, checks the outage's first
  // linked LSI, shows the result inline. No new table column.
  linkStatusState: 'idle' | 'checking' | 'up' | 'down' | 'error' = 'idle';
  linkStatusLsi = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedOutage']) {
      this.linkStatusState = 'idle';
      this.linkStatusLsi = '';
    }
  }

  get hasLinkedLsi(): boolean {
    return !!(this.selectedOutage?.linkedLsis && this.selectedOutage.linkedLsis.length > 0);
  }

  checkLinkStatus(): void {
    const lsi = this.selectedOutage?.linkedLsis?.[0];
    if (!lsi) { return; }
    this.linkStatusLsi = lsi;
    this.linkStatusState = 'checking';
    this.cmService.checkLinkStatus(lsi).subscribe({
      next: data => {
        // DJP reads data?.status directly off the response root, no wrapper.
        const status = (data?.status || '').toLowerCase();
        this.linkStatusState = status === 'link up' ? 'up' : status === 'link down' ? 'down' : 'error';
      },
      error: () => { this.linkStatusState = 'error'; }
    });
  }

  // ---------- Impacted LSI (Additional Details tab) — fully local, no API.
  // The Add/Edit modal itself is NOT declared in this component: it's a
  // position:fixed overlay, and this component lives inside the CRQ page's
  // scale(...) wrapper — a transformed ancestor becomes the containing
  // block for fixed/absolute descendants, which breaks a fixed overlay's
  // full-viewport coverage and stacking order (it ends up behind the
  // sidebar nav). Same reason Create PO / Service Impact / Contact Centre
  // modals are declared as top-level siblings in
  // change-management-crq.component.html, outside that wrapper — this
  // just emits events for the parent to act on instead. ----------
  get impactedLsis(): ImpactedLsiDetail[] {
    return this.selectedOutage?.impactedLsis || [];
  }

  @Output() addLsiClick = new EventEmitter<void>();
  @Output() editLsiClick = new EventEmitter<ImpactedLsiDetail>();

  removeLsi(record: ImpactedLsiDetail): void {
    if (!this.selectedOutage?.impactedLsis) { return; }
    this.selectedOutage.impactedLsis = this.selectedOutage.impactedLsis.filter(r => r.id !== record.id);
  }
}
