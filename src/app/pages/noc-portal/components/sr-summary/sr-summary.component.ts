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

export interface SrSummaryData {
  // 3 columns x 3 fields — SR Number/Impact/Type, Problem Summary/Severity/
  // Sub Type, SR Raised Date/Case Type/Sub Sub Type.
  topInfo: SrSummaryField[][];
  // 3 columns x (5, 5, 4) fields — the SR Details tab's form.
  details: SrSummaryField[][];
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
  // value seeded from the current one); Save Changes commits every field
  // currently being edited at once — the reference only shows a single
  // Save button for the whole form, not a save per field. ----------
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
    for (const col of this.data.details) {
      for (const field of col) {
        const next = this.draft[field.key];
        if (this.editingKeys.has(field.key) && next?.trim()) {
          field.value = next.trim();
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
}
