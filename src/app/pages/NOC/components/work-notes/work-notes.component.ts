import { Component, OnInit } from '@angular/core';
import { WorkNotesService } from '../../services/work-notes.service';

export type WorkNoteType = 'Automation' | 'Manual' | 'Customer Communication' | 'Airtel Works';

export interface WorkNote {
  id: string;
  // null → "No Description Found" shown in red, matching the reference.
  description: string | null;
  createdAt: string;
  oumId: string;
  resourceName: string;
  noteType: WorkNoteType;
  // Shown only in the expanded row.
  firstAcknowledgeTime: string;
  srStatus: string;
}

type FilterKey = 'All' | WorkNoteType;

interface FilterPill {
  key: FilterKey;
  label: string;
}

interface PaginationPage {
  label: string;
  active: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-noc-work-notes',
  templateUrl: './work-notes.component.html',
  styleUrls: ['./work-notes.component.scss']
})
export class WorkNotesComponent implements OnInit {

  constructor(private workNotesService: WorkNotesService) {}

  readonly refreshIcon = '/assets/shared/Refresh.png';
  // Clock.svg for "First acknowledge time"; RefreshCw.svg reused (not a
  // literal refresh action here, just the closest existing status-ish
  // glyph) next to "SR Status" — both per explicit confirmation, no new
  // icon assets introduced.
  readonly clockIcon = '/assets/noc-portal/Clock.svg';
  readonly statusIcon = '/assets/noc-portal/RefreshCw.svg';

  notes: WorkNote[] = [];

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.workNotesService.getWorkNotes().subscribe(notes => {
      this.notes = notes;
    });
  }

  isRefreshing = false;
  onRefresh(): void {
    this.isRefreshing = true;
    this.currentPage = 1;
    this.load();
    setTimeout(() => { this.isRefreshing = false; }, 700);
  }

  onCreateNote(): void {
    console.log('Create Note clicked');
  }

  // ---------- Filter pills — filters against the loaded data, not hidden
  // hard-coded rows. ----------
  readonly filters: FilterPill[] = [
    { key: 'All', label: 'All' },
    { key: 'Automation', label: 'Automation' },
    { key: 'Manual', label: 'Manual' },
    { key: 'Customer Communication', label: 'Customer Communication' },
    { key: 'Airtel Works', label: 'Airtel Works' },
  ];
  activeFilter: FilterKey = 'All';
  setFilter(filter: FilterPill): void {
    this.activeFilter = filter.key;
    this.currentPage = 1;
  }
  get filteredNotes(): WorkNote[] {
    if (this.activeFilter === 'All') { return this.notes; }
    return this.notes.filter(n => n.noteType === this.activeFilter);
  }

  // ---------- "Created by" / "Noted by" dropdowns — options come from the
  // loaded data's own resource names, not a separate invented list. Same
  // custom-dropdown pattern as All SRs' "Sort by". ----------
  get createdByOptions(): string[] {
    return Array.from(new Set(this.notes.map(n => n.resourceName))).sort();
  }
  createdByFilter: string | null = null;
  notedByFilter: string | null = null;
  isCreatedByOpen = false;
  isNotedByOpen = false;
  toggleCreatedBy(): void {
    this.isCreatedByOpen = !this.isCreatedByOpen;
    this.isNotedByOpen = false;
  }
  toggleNotedBy(): void {
    this.isNotedByOpen = !this.isNotedByOpen;
    this.isCreatedByOpen = false;
  }
  setCreatedBy(name: string | null): void {
    this.createdByFilter = name;
    this.isCreatedByOpen = false;
    this.currentPage = 1;
  }
  setNotedBy(name: string | null): void {
    this.notedByFilter = name;
    this.isNotedByOpen = false;
    this.currentPage = 1;
  }
  get displayedNotes(): WorkNote[] {
    return this.filteredNotes.filter(n =>
      (!this.createdByFilter || n.resourceName === this.createdByFilter) &&
      (!this.notedByFilter || n.resourceName === this.notedByFilter)
    );
  }

  // ---------- Row selection ----------
  private selectedIds = new Set<string>();
  isSelected(note: WorkNote): boolean {
    return this.selectedIds.has(note.id);
  }
  toggleSelected(note: WorkNote): void {
    if (this.selectedIds.has(note.id)) { this.selectedIds.delete(note.id); } else { this.selectedIds.add(note.id); }
  }

  // ---------- Row expansion — independent per row; multiple rows can stay
  // expanded at once (no existing table-row-expand pattern dictated
  // single-expand, and this is the more permissive of the two options the
  // task allowed for). ----------
  private expandedIds = new Set<string>();
  isExpanded(note: WorkNote): boolean {
    return this.expandedIds.has(note.id);
  }
  toggleExpanded(note: WorkNote): void {
    if (this.expandedIds.has(note.id)) { this.expandedIds.delete(note.id); } else { this.expandedIds.add(note.id); }
  }
  noteDraft: Record<string, string> = {};

  onActionsClick(note: WorkNote): void {
    console.log('Work note row actions:', note.id);
  }

  // Maps the backend's free-form srStatus string to one of a known set of
  // badge colors; anything unrecognized falls back to a neutral gray rather
  // than breaking.
  private static readonly STATUS_CLASSES: Record<string, string> = {
    'in progress': 'progress',
    'resolved': 'resolved',
    'pending': 'pending',
  };
  statusClass(status: string): string {
    return WorkNotesComponent.STATUS_CLASSES[status.toLowerCase()] ?? 'neutral';
  }

  // ---------- Pagination (same mechanics as All SRs' table) ----------
  readonly pageSize = 6;
  currentPage = 1;

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.displayedNotes.length / this.pageSize));
  }
  get pagedNotes(): WorkNote[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.displayedNotes.slice(start, start + this.pageSize);
  }
  get showingText(): string {
    const total = this.displayedNotes.length;
    if (total === 0) { return 'Showing 0 of 0 entries'; }
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, total);
    return `Showing ${start}-${end} of ${total} entries`;
  }
  get pages(): PaginationPage[] {
    const result: PaginationPage[] = [{ label: 'Previous', active: false }];
    const total = this.totalPages;
    const current = this.currentPage;
    const neighborhood = 1;

    const pageNumbers = new Set<number>([1, total]);
    for (let p = current - neighborhood; p <= current + neighborhood; p++) {
      if (p >= 1 && p <= total) { pageNumbers.add(p); }
    }
    const sorted = Array.from(pageNumbers).sort((a, b) => a - b);

    let prev: number | null = null;
    for (const p of sorted) {
      if (prev !== null && p - prev > 1) {
        result.push({ label: '…', active: false, disabled: true });
      }
      result.push({ label: String(p), active: p === current });
      prev = p;
    }
    result.push({ label: 'Next', active: false });
    return result;
  }
  setPage(page: PaginationPage): void {
    if (page.disabled) { return; }
    if (page.label === 'Previous') { this.goToPage(this.currentPage - 1); return; }
    if (page.label === 'Next') { this.goToPage(this.currentPage + 1); return; }
    this.goToPage(Number(page.label));
  }
  private goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) { return; }
    this.currentPage = page;
  }
}
