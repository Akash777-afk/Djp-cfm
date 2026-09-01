import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImpactedLsiDetail, PlannedOutage } from '../components/types';
import { DetailTab } from './components/planned-outage-input/planned-outage-input.component';
import { ImpactedLsiModalMode } from '../components/impacted-lsi-modal/impacted-lsi-modal.component';
import { CM_SIDEBAR_ITEMS, SidebarNavItem } from '../components/sidebar-nav/sidebar-nav.component';
import { ChangeManagementService } from '../services/change-management.service';
import { SessionService } from '../../../services/session.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-change-management-crq',
  templateUrl: './change-management-crq.component.html',
  styleUrls: ['./change-management-crq.component.scss']
})
export class ChangeManagementCrqComponent implements OnInit {

  constructor(
    private router: Router,
    private cmService: ChangeManagementService,
    private session: SessionService,
    private loadingService: LoadingService,
  ) {}

  // ---------- Responsive scale-to-fit (same approach as incident-management) ----------
  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / ChangeManagementCrqComponent.DESIGN_WIDTH, 1);
  }

  crqSearch = '';
  poIdSearch = '';

  sortBy = 'Sort by...';

  isLoading = true;
  plannedOutages: PlannedOutage[] = [];

  // Detail panel state - populated when a row's "view" export icon is clicked
  selectedOutage: PlannedOutage | null = null;
  activeDetailTab: DetailTab = 'plannedOutage';

  isCreatePoModalOpen = false;
  isServiceImpactModalOpen = false;
  isContactCentreModalOpen = false;

  ngOnInit(): void {
    this.updateScale();
    this.fetchCrqPage();
    this.session.logActivity({
      System: 'Change Management',
      'OLM ID': '',
      Action: 'View',
      Comments: 'User viewed Change Management CRQ page',
    }).subscribe();
  }

  private fetchCrqPage(): void {
    this.isLoading = true;
    this.loadingService.show();
    this.cmService.getCrqPageData(this.crqSearch || undefined, this.poIdSearch || undefined).subscribe(({ plannedOutages }) => {
      this.plannedOutages = plannedOutages;
      this.selectedOutage = plannedOutages[0] || null;
      this.isLoading = false;
      this.loadingService.hide();
    });
  }

  onToolbarRefresh(): void {
    this.fetchCrqPage();
  }

  onSearch(): void {
    this.fetchCrqPage();
  }

  onReset(): void {
    this.crqSearch = '';
    this.poIdSearch = '';
    this.fetchCrqPage();
  }

  onCreatePo(): void {
    this.isCreatePoModalOpen = true;
  }

  onCreatePoModalClosed(): void {
    this.isCreatePoModalOpen = false;
  }

  onPoCreated(outage: PlannedOutage): void {
    this.plannedOutages = [outage, ...this.plannedOutages];
  }

  onServiceImpactClick(): void {
    this.isServiceImpactModalOpen = true;
  }

  onServiceImpactModalClosed(): void {
    this.isServiceImpactModalOpen = false;
  }

  onContactCentreClick(): void {
    this.isContactCentreModalOpen = true;
  }

  onContactCentreModalClosed(): void {
    this.isContactCentreModalOpen = false;
  }

  sidebarItems: SidebarNavItem[] = CM_SIDEBAR_ITEMS;

  onSidebarItemClick(key: string): void {
    switch (key) {
      case 'lsi-search':      this.onLsiSearch(); break;
      case 'create-po':       this.onCreatePo(); break;
      case 'service-impact':  this.onServiceImpactClick(); break;
      case 'contact-centre':  this.onContactCentreClick(); break;
    }
  }

  onLsiSearch(): void {
    this.router.navigate(['/noc-portal']);
  }

  onExport(): void {
    // TODO: trigger export
  }

  selectOutage(outage: PlannedOutage): void {
    this.selectedOutage = outage;
  }

  setDetailTab(tab: DetailTab): void {
    this.activeDetailTab = tab;
  }

  // NOTE on interpretation: DJP's own detail view has no single dedicated
  // "Save"/"Update" button distinct from field editing — updatePo() there
  // is presumably wired to a save affordance never captured in this
  // investigation. DJP-CFM's 3-icon row (Assignee/Notify/More options) has
  // no "Save" icon either. Of the three, "Assignee" is the only one that
  // reads as "commit a change to this outage" rather than a side action
  // (Notify = send email, More options = overflow menu), so it's used here
  // to trigger the Update flow. Flagging this as an interpretation, not a
  // confirmed DJP behavior — see the verification report.
  onAssigneeClick(): void {
    this.onSaveOutage();
  }

  // Real Update flow (#6 + #8): syncPo with the outage's existing
  // "Planned Outage Id" present (an update, not a create — same endpoint as
  // Create PO, DJP's own upsert semantics), then fire-and-forget
  // updatePoInternal on success, then refresh the list — mirrors
  // SearchCrqPoComponent.updatePo() exactly, including its own re-fetch.
  isSaving = false;
  saveMessage: { type: 'success' | 'error'; text: string } | null = null;

  onSaveOutage(): void {
    if (!this.selectedOutage) { return; }
    const o = this.selectedOutage;
    this.isSaving = true;
    this.saveMessage = null;
    const fields = {
      'Planned Outage Id': o.outageId,
      'Activity Location': o.rawData?.['Activity Location'] || '',
      'Benefit Of Change': o.rawData?.['Benefit Of Change'] || '',
      Category: o.rawData?.['Category'] || '',
      'Change Description': o.description,
      'Change Type': o.changeType,
      Impact: o.impact,
      Implementer: o.implementer,
      'Duration in Min': o.rawData?.['Duration in Min'] || '',
      'Outage Reason': o.reason,
      'Planned End Date': o.endDate,
      'Planned Start Date': o.startDate,
      'Requester Email Id': o.rawData?.['Requester Email Id'] || '',
      'Type of Change': o.rawData?.['Type of Change'] || '',
      Status: o.status,
    };
    const payload = this.cmService.buildSyncPoPayload(fields);
    // syncPlannedOutage has no catchError/mock fallback (a write shouldn't
    // silently fake success) — both next AND error must be handled, or a
    // real backend failure leaves isSaving stuck true with no feedback.
    this.cmService.syncPlannedOutage(payload).subscribe({
      next: data => {
        this.isSaving = false;
        // Verified success convention: StatusMessage === 'Success' (not
        // {Code:'000'}) — see change-management.types.ts.
        if (data && data.StatusMessage === 'Success') {
          this.saveMessage = { type: 'success', text: 'PO details updated successfully' };
          this.cmService.updatePoInternal(fields).subscribe();
          this.fetchCrqPage();
        } else {
          this.saveMessage = { type: 'error', text: data?.StatusMessage || 'Something went wrong, please try again' };
        }
      },
      error: err => {
        this.isSaving = false;
        console.error('[ChangeManagementCrq] syncPlannedOutage failed:', err);
        this.saveMessage = { type: 'error', text: 'Unable to reach the server, please try again' };
      },
    });
  }

  // Real Notify flow (#9) — DJP only sends if the PO has at least one
  // linked LSI, else shows a local error with no API call at all.
  isNotifying = false;
  notifyMessage: { type: 'success' | 'error'; text: string } | null = null;

  onNotifyClick(): void {
    if (!this.selectedOutage) { return; }
    if (!this.selectedOutage.linkedLsis || this.selectedOutage.linkedLsis.length === 0) {
      this.notifyMessage = { type: 'error', text: 'No LSI found against PO' };
      return;
    }
    this.isNotifying = true;
    this.notifyMessage = null;
    const payload = { body: { ListofPlannedOutage: [{ PlannedOutageId: this.selectedOutage.outageId }] } };
    // mailOutage has no catchError/mock fallback either — same reasoning
    // as syncPlannedOutage above.
    this.cmService.mailOutage(payload).subscribe({
      next: data => {
        this.isNotifying = false;
        // Verified success convention: a distinct literal from #6's —
        // StatusMessage === 'Communications sent successfully'.
        if (data && data.StatusMessage === 'Communications sent successfully') {
          this.notifyMessage = { type: 'success', text: data.StatusMessage };
        } else {
          this.notifyMessage = { type: 'error', text: data?.StatusMessage || 'Something went wrong, please try again' };
        }
      },
      error: err => {
        this.isNotifying = false;
        console.error('[ChangeManagementCrq] mailOutage failed:', err);
        this.notifyMessage = { type: 'error', text: 'Unable to reach the server, please try again' };
      },
    });
  }

  onMoreOptionsClick(): void {
    console.log('More options clicked');
  }

  // ---------- Impacted LSI Add/Edit modal (see planned-outage-input's note
  // on why this lives up here instead of on that component) ----------
  isLsiModalOpen = false;
  lsiModalMode: ImpactedLsiModalMode = 'add';
  editingLsi: ImpactedLsiDetail | null = null;

  onAddLsiClick(): void {
    this.lsiModalMode = 'add';
    this.editingLsi = null;
    this.isLsiModalOpen = true;
  }

  onEditLsiClick(record: ImpactedLsiDetail): void {
    this.lsiModalMode = 'edit';
    this.editingLsi = record;
    this.isLsiModalOpen = true;
  }

  onLsiModalClosed(): void {
    this.isLsiModalOpen = false;
  }

  onLsiSaved(record: ImpactedLsiDetail): void {
    if (!this.selectedOutage) { return; }
    if (!this.selectedOutage.impactedLsis) { this.selectedOutage.impactedLsis = []; }
    const existingIndex = this.selectedOutage.impactedLsis.findIndex(r => r.id === record.id);
    if (existingIndex >= 0) {
      this.selectedOutage.impactedLsis[existingIndex] = record;
    } else {
      this.selectedOutage.impactedLsis = [record, ...this.selectedOutage.impactedLsis];
    }
    this.isLsiModalOpen = false;
  }
}
