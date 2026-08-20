import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ALL_NSTT_COLUMNS, NsttColumnField } from '../../incident-management.constants';

// "Custom Settings" column-configuration modal — lets the user choose which
// of DJP's real NSTTColumnListValue fields (see incident-management.constants.ts)
// appear as Incident Management table columns, and in what order.
//
// This component is purely presentational/stateless with respect to
// persistence: it works entirely off @Input() selectedKeys (the parent's
// last *saved* order) and emits the new order via (save) — the parent
// (IncidentManagementComponent) owns turning that into the real
// {columnNameValues: {...}} payload and calling
// IncidentManagementService.updateColumnPreferences(). No HTTP, no
// service dependency here, same convention as every other dumb child
// component in this module (all-nstts, nstt-status, nstt-sr-drawer).
//
// Ordering is intentionally NOT sent to any API — DJP's real
// UpdateUserColumnList contract only stores Y/N visibility per field, no
// order at all (confirmed from djp/incidentmanagement source). Reordering
// here only affects this session's table column order via the parent's
// in-memory selectedColumnOrder; it isn't persisted across a reload. See
// the parent's onColumnSettingsSave() for exactly what *is* sent.
@Component({
  selector: 'app-column-settings-modal',
  templateUrl: './column-settings-modal.component.html',
  styleUrls: ['./column-settings-modal.component.scss'],
})
export class ColumnSettingsModalComponent implements OnChanges {

  @Input() open = false;
  // Ordered keys the parent last saved (or the session default) — what
  // "Cancel" reverts to, and what the draft lists are rebuilt from every
  // time the modal opens, so opening/cancelling can never lose the
  // currently-saved configuration.
  @Input() selectedKeys: string[] = [];

  @Output() save = new EventEmitter<string[]>();
  @Output() closed = new EventEmitter<void>();

  readonly allColumns = ALL_NSTT_COLUMNS;

  // Working copies — mutated live as the user drags/adds/removes, discarded
  // on Cancel (never written back to @Input, only emitted on Save).
  draftAvailable: NsttColumnField[] = [];
  draftSelected: NsttColumnField[] = [];

  availableSearchQuery = '';
  selectedSearchQuery = '';

  // Explicit ids (rather than comparing cdkDropListData by reference) so
  // onDrop() can reliably tell which list a drag started/ended in even
  // though the lists rendered are filtered *views*, not the draft arrays
  // themselves — see onDrop() below.
  readonly availableListId = 'csm-available-list';
  readonly selectedListId = 'csm-selected-list';

  ngOnChanges(changes: SimpleChanges): void {
    // Rebuild the draft fresh every time the modal transitions to open (not
    // just once) — this is what makes "opening settings never loses your
    // saved config" and "Cancel discards changes" true for free, without
    // any explicit snapshot/restore bookkeeping: there's simply nothing to
    // restore from, the draft is always rebuilt from the last-saved input.
    if (changes['open'] && this.open) {
      this.resetDraftFromInput();
    }
  }

  private resetDraftFromInput(): void {
    const selectedSet = new Set(this.selectedKeys);
    this.draftSelected = this.selectedKeys
      .map(key => this.allColumns.find(c => c.key === key))
      .filter((c): c is NsttColumnField => !!c);
    this.draftAvailable = this.allColumns.filter(c => !selectedSet.has(c.key));
    this.availableSearchQuery = '';
    this.selectedSearchQuery = '';
  }

  // ---------- Search (filters the *displayed* list only — draftAvailable/
  // draftSelected, the real source of truth for counts and Save, are never
  // touched by search) ----------
  get filteredAvailable(): NsttColumnField[] {
    const q = this.availableSearchQuery.trim().toLowerCase();
    return q ? this.draftAvailable.filter(c => c.label.toLowerCase().includes(q)) : this.draftAvailable;
  }
  get filteredSelected(): NsttColumnField[] {
    const q = this.selectedSearchQuery.trim().toLowerCase();
    return q ? this.draftSelected.filter(c => c.label.toLowerCase().includes(q)) : this.draftSelected;
  }

  // ---------- Drag & drop ----------
  // CDK's default moveItemInArray/transferArrayItem operate by numeric
  // index against whatever array is bound to [cdkDropListData] — but that's
  // the *filtered* view here (so the rendered drag handles line up with
  // what's actually on screen while searching), not the real draft array.
  // Splicing the real arrays by that filtered index directly would corrupt
  // order/membership as soon as a search filter hides anything. Instead:
  // identify the dragged field by its own key (not index), remove it from
  // its real source array, then re-derive "where in the destination's
  // *currently visible* list did it land" and insert before that same
  // neighbor's real position — correct with or without an active filter,
  // and correct for both cross-list moves and same-list reordering.
  onDrop(event: CdkDragDrop<NsttColumnField[]>): void {
    const field: NsttColumnField = event.item.data;
    const targetIsSelected = event.container.id === this.selectedListId;
    const sourceIsSelected = event.previousContainer.id === this.selectedListId;

    const srcRealList = sourceIsSelected ? this.draftSelected : this.draftAvailable;
    const destRealList = targetIsSelected ? this.draftSelected : this.draftAvailable;

    const srcIndex = srcRealList.findIndex(c => c.key === field.key);
    if (srcIndex === -1) { return; }
    srcRealList.splice(srcIndex, 1);

    const destFilteredNow = targetIsSelected ? this.filteredSelected : this.filteredAvailable;
    const clampedIndex = Math.min(event.currentIndex, destFilteredNow.length);
    const neighbor = destFilteredNow[clampedIndex];
    const neighborRealIndex = neighbor ? destRealList.findIndex(c => c.key === neighbor.key) : -1;
    destRealList.splice(neighborRealIndex === -1 ? destRealList.length : neighborRealIndex, 0, field);
  }

  // ---------- Non-drag transfer affordances (per-row + / ×, per the
  // "drag & drop + transfer controls" option — drag stays primary, these
  // are a secondary, always-available fallback) ----------
  moveToSelected(field: NsttColumnField): void {
    const idx = this.draftAvailable.findIndex(c => c.key === field.key);
    if (idx === -1) { return; }
    this.draftAvailable.splice(idx, 1);
    this.draftSelected.push(field);
  }
  moveToAvailable(field: NsttColumnField): void {
    const idx = this.draftSelected.findIndex(c => c.key === field.key);
    if (idx === -1) { return; }
    this.draftSelected.splice(idx, 1);
    this.draftAvailable.push(field);
  }

  // ---------- Footer ----------
  onSave(): void {
    this.save.emit(this.draftSelected.map(c => c.key));
  }
  onCancel(): void {
    // Nothing to roll back — the draft was never written anywhere the
    // parent can see. Just tell the parent to close.
    this.closed.emit();
  }
  onBackdropClick(): void {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) { this.closed.emit(); }
  }
}
