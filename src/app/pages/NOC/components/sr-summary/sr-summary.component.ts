import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SrSummaryService } from '../../services/sr-summary.service';

// One labeled field — reused for both the read-only top info strip and the
// editable SR Details form (top info fields just never have editable:true).
// Same "array of columns, not one field per template line" approach as
// every other data-driven section on this page (SR Insights' fields,
// Product Details' 3-col grid) — new fields/columns come from the backend
// response, not a template edit.
export interface SrSummaryField {
  key: string;
  label: string;
  value: string;
  editable: boolean;
}

export interface SrSummaryTab {
  key: string;
  label: string;
}

// ---------- Relationship tab ----------
export interface IncidentRow {
  incNumber: string;
  location: string;
  actualEventTime: string;
  status: string;
  statusReason: string;
  ert: string;
  upTime: string;
}
export interface RelationshipData {
  incidents: IncidentRow[];
  circuitTopology: {
    elanNumber: string;
    entityId: string;
  };
}

// ---------- Callback task tab — a real create-form (always-editable
// inputs), not the SR Details tab's display-then-edit-on-pencil pattern, so
// it gets its own plain data shape rather than SrSummaryField[][]. ----------
export interface CallbackTaskData {
  customerName: string;
  customerContactNumber: string;
  customerEmailAddress: string;
  alternateContactNumber: string;
  reasonForCallback: string;
  customerAvailabilityTime: string;
}

export interface SrSummaryData {
  // 3 columns x 3 fields — SR Number/Impact/Type, Problem Summary/Severity/
  // Sub Type, SR Raised Date/Case Type/Sub Sub Type.
  topInfo: SrSummaryField[][];
  // 3 columns x (5, 5, 4) fields — the SR Details tab's form.
  details: SrSummaryField[][];
  relationship: RelationshipData;
  callbackTask: CallbackTaskData;
  // Same SrSummaryField[][] shape as `details` on purpose — both tabs reuse
  // the exact same .srs-form-card template/pencil-to-edit interaction
  // instead of introducing a second form pattern.
  resolutionTasks: SrSummaryField[][];
  dateTime: SrSummaryField[][];
}

interface QuickAction {
  key: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-noc-sr-summary',
  templateUrl: './sr-summary.component.html',
  styleUrls: ['./sr-summary.component.scss']
})
export class SrSummaryComponent implements OnInit, OnChanges {

  constructor(private srSummaryService: SrSummaryService) {}

  // Which SR this panel is showing — bound from the parent's own searched
  // SR number (noc-portal.component.ts's srQuery), same "backend call keyed
  // off the searched SR" flow SrDetailsService already uses. Re-fetches
  // whenever a new SR is searched, not just once on first load.
  @Input() srNumber = '';

  data: SrSummaryData | null = null;

  ngOnInit(): void {
    this.load();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.srNumber && !changes.srNumber.firstChange) {
      this.load();
    }
  }
  private load(): void {
    this.srSummaryService.getSrSummary(this.srNumber).subscribe(data => {
      this.data = data;
      this.editingKeys.clear();
      this.draft = {};
    });
  }

  // ---------- Tabs — only 'details' has real content; the rest stay
  // functional (clickable, update the active state) without inventing
  // content that isn't specified yet, per the task's own instruction. ----------
  readonly tabs: SrSummaryTab[] = [
    { key: 'details',      label: 'SR Details' },
    { key: 'management',   label: 'SR Management' },
    { key: 'relationship', label: 'Relationship' },
    { key: 'callback',     label: 'Callback task' },
    { key: 'resolution',   label: 'Resolution' },
    { key: 'history',      label: 'SR history' },
    { key: 'datetime',     label: 'Date/Time' },
  ];
  activeTab = this.tabs[0].key;
  setActiveTab(tab: SrSummaryTab): void {
    this.activeTab = tab.key;
  }
  get activeTabLabel(): string {
    return this.tabs.find(t => t.key === this.activeTab)?.label ?? '';
  }

  // ---------- The 3 circular action buttons next to the tabs — per
  // confirmed mapping: two-person icon = Participants, person+plus =
  // Add participant, person+link = Linked SRs. ----------
  readonly quickActions: QuickAction[] = [
    { key: 'participants',    icon: '/assets/NOC_Portal/Group ssr5.png', label: 'Participants' },
    { key: 'add-participant', icon: '/assets/NOC_Portal/Group ssr4.png', label: 'Add participant' },
    { key: 'linked-srs',      icon: '/assets/NOC_Portal/Group ssr3.svg', label: 'Linked SRs' },
  ];
  onQuickActionClick(key: string): void {
    console.log('SR Summary quick action:', key);
  }

  // ---------- SR Details form: per-field inline editing. Clicking a
  // field's pencil swaps its display span for a real <input> (its own draft
  // value seeded from the current one); pressing Enter in that input commits
  // every field currently being edited at once via saveChanges() below. The
  // row that used to hold a dedicated "Save changes" button now holds the 4
  // SR-level action buttons instead — Create note is the one that also
  // commits any in-progress edits (see its own comment below), so Enter-to-
  // commit isn't the only way to save anymore. ----------
  private editingKeys = new Set<string>();
  draft: Record<string, string> = {};
  isEditing(field: SrSummaryField): boolean {
    return this.editingKeys.has(field.key);
  }
  startEdit(field: SrSummaryField): void {
    if (!field.editable) { return; }
    this.draft[field.key] = field.value;
    this.editingKeys.add(field.key);
  }

  isSaving = false;
  justSaved = false;
  saveChanges(): void {
    if (!this.data || this.editingKeys.size === 0) { return; }
    this.isSaving = true;
    // Real API call (e.g. PATCH /sr/{srNumber}) goes here later — for now,
    // commit the draft into local state, same "swap the inside of this one
    // method later" convention as every mock service in this app. Blank
    // edits are dropped rather than saved, per "validate where appropriate".
    // Covers every SrSummaryField[][] grid on this component (SR Details,
    // Resolution Tasks, Date/Time) in one pass, not just `details` — a
    // field being edited on any of those 3 tabs commits correctly
    // regardless of which tab happens to be active when Create note is
    // clicked, since editingKeys/draft are keyed by field.key across all of
    // them already.
    for (const grid of [this.data.details, this.data.resolutionTasks, this.data.dateTime]) {
      for (const col of grid) {
        for (const field of col) {
          const next = this.draft[field.key];
          if (this.editingKeys.has(field.key) && next?.trim()) {
            field.value = next.trim();
          }
        }
      }
    }
    this.editingKeys.clear();
    setTimeout(() => {
      this.isSaving = false;
      this.justSaved = true;
      setTimeout(() => { this.justSaved = false; }, 1600);
    }, 400);
  }

  // ---------- The 4 SR-level action buttons in place of the old single
  // Save changes button — Resolve/Assign task (outline) and View notes/
  // Create note (solid). No spec given yet for what each actually does, so
  // these stay console.log stubs, same convention as every other
  // not-yet-specified action in this app. ----------
  onResolve(): void {
    console.log('SR Summary: Resolve clicked', this.srNumber);
  }
  onAssignTask(): void {
    console.log('SR Summary: Assign task clicked', this.srNumber);
  }
  onViewNotes(): void {
    console.log('SR Summary: View notes clicked', this.srNumber);
  }
  onCreateNote(): void {
    // Doubles as this form's save action — there's no dedicated "Save
    // changes" button anymore, and Create note is the one of the 4 that's
    // meant to commit whatever fields are currently being edited (per
    // explicit confirmation), on top of whatever "create a note" itself
    // ends up doing once that's specified.
    this.saveChanges();
    console.log('SR Summary: Create note clicked', this.srNumber);
  }

  // ---------- Relationship tab: incident search + Circuit Topology link.
  // No incident-search API specified yet, so this stays a stub like every
  // other not-yet-specified action here — the table itself already renders
  // real (mock) data regardless of what's searched. ----------
  incidentSearchQuery = '';
  onIncidentSearch(): void {
    console.log('Relationship: incident search', this.srNumber, this.incidentSearchQuery);
  }
  onViewIncidentNotes(row: IncidentRow): void {
    console.log('Relationship: view notes for incident', row.incNumber);
  }
  onViewCircuitTopology(): void {
    console.log('Relationship: view circuit topology', this.data?.relationship.circuitTopology);
  }

  // ---------- Callback task tab: a real create-form, own validation/submit
  // rather than the pencil-to-edit pattern (see CallbackTaskData's own
  // comment). Row 1 (name/contact/email) is what actually identifies who to
  // call back, so those 3 are required; row 2 stays optional. ----------
  readonly reasonForCallbackOptions: string[] = [
    'Customer requested update',
    'Escalation follow-up',
    'Resolution confirmation',
    'Additional information needed',
  ];
  callbackSubmitted = false;
  get isCallbackValid(): boolean {
    const cb = this.data?.callbackTask;
    return !!cb && !!cb.customerName.trim() && !!cb.customerContactNumber.trim() && !!cb.customerEmailAddress.trim();
  }
  onCallbackSubmit(): void {
    if (!this.isCallbackValid) { return; }
    // Real API call (e.g. POST /sr/{srNumber}/callback-tasks) goes here
    // later — for now just confirm, same mock-first convention as
    // saveChanges() above.
    console.log('Callback task: submit', this.data?.callbackTask);
    this.callbackSubmitted = true;
    setTimeout(() => { this.callbackSubmitted = false; }, 1600);
  }
}
