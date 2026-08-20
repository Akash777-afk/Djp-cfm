import { Component, HostListener, OnInit } from '@angular/core';
import { StatTile } from './components/nstt-status/nstt-status.component';
import { NsttRow } from './components/all-nstts/all-nstts.component';
import { ALL_NSTT_COLUMNS, DEFAULT_BINS, DEFAULT_SELECTED_COLUMNS } from './incident-management.constants';
import { IncidentManagementService } from './services/incident-management.service';
import { SessionService } from '../../services/session.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-incident-management',
  templateUrl: './incident-management.component.html',
  styleUrls: ['./incident-management.component.scss']
})
export class IncidentManagementComponent implements OnInit {

  constructor(
    private imService: IncidentManagementService,
    private session: SessionService,
    private loadingService: LoadingService,
  ) {}

  // ---------- Responsive scale-to-fit (same approach as the landing canvas) ----------
  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  ngOnInit(): void {
    this.updateScale();
    this.fetchDashboard();

    // Best-effort: replace the hardcoded welcome name with the real
    // logged-in user's name — same pattern as EscalationMatrixComponent.
    this.session.getCurrentUser().subscribe(user => {
      const name = user?.userData?.givenName;
      if (name) { this.userName = name; }
      const realOlmId = user?.userData?.username;
      if (realOlmId && realOlmId !== this.olmId) {
        // This resolves after fetchDashboard() above already ran with
        // olmId still '' (getCurrentUser() is async, so it can never win
        // that race) — re-fetch now that we actually have a real OLM ID,
        // so the escalated-SR count is scoped to this user instead of an
        // unfiltered/blank query.
        this.olmId = realOlmId;
        this.fetchDashboard();
      }
      // Column preferences depend on olmId, which we only just learned —
      // (re)fetch now rather than at page-load time when it was still empty.
      this.fetchColumnPreferences();
    });
    this.session.logActivity({
      System: 'Incident Management',
      'OLM ID': this.olmId,
      Action: 'View',
      Comments: 'User viewed Incident Management dashboard',
    }).subscribe();
  }

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / IncidentManagementComponent.DESIGN_WIDTH, 1);
  }

  // ---------- Welcome banner ----------
  userName = 'Akash Ganapathy2';
  olmId = '';

  // Real broadcast-call hyperlink (API #33) — DJP's call() opens
  // data.IM.broadCastCall in a new tab; falls back to a no-op if the real
  // call fails (session.getHyperLinkNavurls already swallows errors).
  onCallClick(): void {
    this.session.getHyperLinkNavurls().subscribe(data => {
      const url = data?.IM?.broadCastCall;
      if (url) { window.open(url); }
    });
  }
  onBookClick(): void {
    console.log('Book clicked');
  }

  // ---------- Dashboard data (stat tiles + NSTT table) ----------
  isLoading = true;
  statTiles: StatTile[] = [];
  nsttRows: NsttRow[] = [];
  groupOptions: string[] = [];
  selectedBins: string[] = DEFAULT_BINS;

  private fetchDashboard(): void {
    this.isLoading = true;
    this.loadingService.show();
    this.imService.getDashboardData(this.selectedBins, this.olmId).subscribe(({ statTiles, nsttRows, groupOptions }) => {
      this.statTiles = statTiles;
      this.nsttRows = nsttRows;
      this.groupOptions = groupOptions;
      this.isLoading = false;
      this.loadingService.hide();
    });
  }

  // Bin selection is a real query parameter of the list API, not a
  // client-side filter — re-fetches on every change (matches DJP's own
  // fectNsttDetailBybin() behavior).
  onBinChange(bins: string[]): void {
    this.selectedBins = bins;
    this.fetchDashboard();
  }

  // ---------- Column preferences / Custom Settings modal (API #5) ----------
  // Raw Y/N map as the real API returns it — kept only to build the next
  // Save payload (every one of ALL_NSTT_COLUMNS' 34 keys, matching DJP's
  // own updateColumnValues() which always sends the complete field set, not
  // just the ones that changed).
  columnPreferences: Record<string, 'Y' | 'N'> | null = null;
  // Ordered *selected* keys — the modal's source of truth and what actually
  // drives the table's column order. DJP's real API has no order field at
  // all (Y/N visibility only), so order lives here as session-only client
  // state: derived once from columnPreferences the first time it arrives
  // (see columnOrderInitialized below), then only ever updated by the
  // modal's own (save) output — never silently rebuilt from
  // columnPreferences again, so a later unrelated columnPreferences change
  // can't clobber a reorder the user already made this session.
  selectedColumnOrder: string[] = DEFAULT_SELECTED_COLUMNS.slice();
  private columnOrderInitialized = false;

  isColumnSettingsOpen = false;
  openColumnSettings(): void {
    this.isColumnSettingsOpen = true;
  }
  onColumnSettingsClosed(): void {
    this.isColumnSettingsOpen = false;
  }

  private fetchColumnPreferences(): void {
    if (!this.olmId) { return; }
    this.loadingService.show();
    this.imService.getColumnPreferences(this.olmId).subscribe(prefs => {
      this.columnPreferences = prefs;
      if (prefs && !this.columnOrderInitialized) {
        this.columnOrderInitialized = true;
        this.selectedColumnOrder = ALL_NSTT_COLUMNS
          .filter(c => prefs[c.key] === 'Y')
          .map(c => c.key);
      }
      this.loadingService.hide();
    });
  }

  // (save) from the Custom Settings modal — an ordered array of selected
  // keys. Builds DJP's real full-field {columnNameValues} payload (every
  // one of the 34 known fields present as 'Y' or 'N', matching
  // ImDashboardUiComponent.updateColumnValues()) and calls the existing,
  // unmodified updateColumnPreferences() — same URL/payload-envelope/
  // success-convention as before this feature, just a bigger field set.
  onColumnSettingsSave(newOrder: string[]): void {
    this.selectedColumnOrder = newOrder;
    this.columnOrderInitialized = true;
    this.isColumnSettingsOpen = false;

    const selectedSet = new Set(newOrder);
    const columnNameValues: Record<string, 'Y' | 'N'> = {};
    for (const col of ALL_NSTT_COLUMNS) {
      columnNameValues[col.key] = selectedSet.has(col.key) ? 'Y' : 'N';
    }
    this.columnPreferences = columnNameValues;

    if (!this.olmId) { return; }
    this.loadingService.show();
    this.imService.updateColumnPreferences(this.olmId, columnNameValues).subscribe({
      next: res => {
        this.loadingService.hide();
        // Real convention is {status:'Success'} — not {Code:'000'} — see
        // incident-management.types.ts's ColumnPreferencesUpdateResponse.
        if (res?.status !== 'Success') {
          console.warn('[IncidentManagementComponent] Column preference save did not report success:', res);
        }
      },
      error: err => {
        this.loadingService.hide();
        console.warn('[IncidentManagementComponent] Column preference save failed:', err);
      },
    });
  }

  // ---------- Which single stat tile is currently active ----------
  activeCardKey = 'all';

  private readonly keyToStatus: Record<string, string> = {
    'in-progress': 'In progress',
    assigned: 'Assigned',
    escalated: 'Escalated',
    resolved: 'Resolved',
    closed: 'Closed',
    cancelled: 'Cancelled',
    unknown: 'Unknown',
  };

  get statusFilter(): string | null {
    return this.activeCardKey === 'all' ? null : this.keyToStatus[this.activeCardKey];
  }

  setActiveCard(key: string): void {
    this.activeCardKey = key;
  }

  // ---------- Expand-to-child-SRs drawer ----------
  expandedRow: NsttRow | null = null;
  onExpandRow(row: NsttRow): void {
    this.expandedRow = row;
  }
  onDrawerClosed(): void {
    this.expandedRow = null;
  }
}
