import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { DashboardChangeRow, DashboardChangeStatus, StatCard } from '../landing/change-management-landing.types';
import { PlannedOutage } from '../components/types';
import {
  getMockCrqPageData, getMockDashboardData, getMockDropdownValues, getMockLinkStatusResponse,
  getMockMailOutageResponse, getMockPoInternalResponse, getMockServiceImpactRows, getMockSyncPoResponse,
} from './change-management.mock';
import {
  CmDashboardData, CrqLiveApiRow, CrqPageData, CrqValidationResponse, LinkStatusResponse,
  MailOutageResponse, PlannedOutageApiRow, PoInternalResponse, ServiceImpactApiRow, SyncPoResponse,
} from './change-management.types';

@Injectable({
  providedIn: 'root'
})
export class ChangeManagementService {

  constructor(private http: HttpClient) {}

  private readonly baseUrl = environment.apiEndPoint;
  private readonly REQUEST_TIMEOUT_MS = 20000;

  // Change Management-wide mock switch (see environment.ts). When true, no
  // method below ever calls this.http — every one of them short-circuits to
  // mock data before building a request, so no network entry is created at
  // all (not "call then fall back", an outright skip). Scoped to this
  // service only: Incident Management, Escalation Matrix and NOC Portal use
  // their own services and are unaffected.
  private readonly useMock = environment.useMockChangeManagement;

  private readonly getHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    Authorization: 'Basic Q0ZNVVNFUjpjdWJhc3Rpb25AMTIz',
  });

  private readonly postHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  });

  // ---------- #1 Get Live CRQ/PO Data ----------
  // GET {apiEndPoint}/cfm-mise/cm-api/getRemedyCRQLiveSelectedData?fromDate=&toDate=
  private getLiveCrqDataRaw(fromDate?: string, toDate?: string): Observable<CrqLiveApiRow[] | CrqLiveApiRow> {
    const url = `${this.baseUrl}/cfm-mise/cm-api/getRemedyCRQLiveSelectedData`;
    let params = new HttpParams();
    if (fromDate) { params = params.set('fromDate', fromDate); }
    if (toDate) { params = params.set('toDate', toDate); }
    return this.http.get<CrqLiveApiRow[] | CrqLiveApiRow>(url, { headers: this.getHeaders, params }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS)
    );
  }

  // ---------- #2 Query Planned Outages ----------
  // POST {apiEndPoint}/cfm-mise/cm-api/queryplannedoutage
  private getPlannedOutagesRaw(payload: any): Observable<PlannedOutageApiRow[]> {
    const url = `${this.baseUrl}/cfm-mise/cm-api/queryplannedoutage`;
    return this.http.post<PlannedOutageApiRow[]>(url, payload, { headers: this.postHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS)
    );
  }

  // ---------- #3 Get CRQ Data (validate) ----------
  // GET {apiEndPoint}/cfm-mise/cm-api/getRemedyCRQ?changeid=
  validateCrq(changeId: string): Observable<{ valid: boolean }> {
    if (this.useMock) { return of({ valid: true }); }
    const url = `${this.baseUrl}/cfm-mise/cm-api/getRemedyCRQ?changeid=${encodeURIComponent(changeId)}`;
    return this.http.get<CrqValidationResponse>(url, { headers: this.getHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS),
      // DJP's own convention: array-length truthiness, no Code/status field.
      map(data => ({ valid: !!(data && data.length > 0) })),
      catchError(err => {
        console.warn('[ChangeManagementService] validateCrq failed:', err);
        return of({ valid: false });
      })
    );
  }

  // ---------- #4 Get Dropdown Values ----------
  // GET {apiEndPoint}/cfm-mise/cm-api/getDropDownValues?name=
  // Cached per name (shareReplay, same pattern as SessionService.
  // getCurrentUser) — Create PO modal and the CRQ detail panel both fetch
  // several of the same dropdown names independently on their own ngOnInit,
  // so without this every page load fires each one twice. catchError sits
  // *inside* the cached pipe (before shareReplay) so the mock fallback
  // itself gets cached too — once a name has fallen back, later callers in
  // the same session get the mock instantly instead of re-attempting a
  // 20s-timeout real call every time.
  private dropdownCache = new Map<string, Observable<string[]>>();

  getDropdownValues(name: string): Observable<string[]> {
    if (this.useMock) { return of(getMockDropdownValues(name)); }
    if (!this.dropdownCache.has(name)) {
      const url = `${this.baseUrl}/cfm-mise/cm-api/getDropDownValues?name=${encodeURIComponent(name)}`;
      this.dropdownCache.set(name, this.http.get<string[]>(url, { headers: this.getHeaders }).pipe(
        timeout(this.REQUEST_TIMEOUT_MS),
        map(data => data || []),
        catchError(err => {
          console.warn(`[ChangeManagementService] getDropdownValues(${name}) failed, using mock fallback:`, err);
          return of(getMockDropdownValues(name));
        }),
        shareReplay(1),
      ));
    }
    return this.dropdownCache.get(name)!;
  }

  // ---------- #5 Get LSIs Against Node (Service Impact) ----------
  // GET {apiEndPoint}/cfm-mise/cm-api/getLSIAgainstNode?domain=&node=
  getServiceImpactedLsis(domain: string, node: string): Observable<ServiceImpactApiRow[]> {
    if (this.useMock) { return of(getMockServiceImpactRows()); }
    const url = `${this.baseUrl}/cfm-mise/cm-api/getLSIAgainstNode?domain=${encodeURIComponent(domain)}&node=${encodeURIComponent(node)}`;
    return this.http.get<ServiceImpactApiRow[]>(url, { headers: this.getHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS),
      catchError(err => {
        console.warn('[ChangeManagementService] getServiceImpactedLsis failed, using mock fallback:', err);
        return of(getMockServiceImpactRows());
      })
    );
  }

  // ---------- #6 Sync Planned Outage (create/update) ----------
  // POST {apiEndPoint}/cfm-mise/cm-api/syncplannedoutage
  private mockPoIdCounter = 110039500;

  syncPlannedOutage(payload: any): Observable<SyncPoResponse> {
    if (this.useMock) {
      // Echo back an existing "Planned Outage Id" on update (fields carries
      // one), or mint a new-looking one on create (fields has none) — same
      // shape the real backend's response is read for either way.
      const fields = payload?.body?.SiebelMessage?.['ListOfB2B Planned Outage IO']?.['B2B Planned Outage BC'];
      const outageId = fields?.['Planned Outage Id'] || (this.mockPoIdCounter++).toString();
      return of(getMockSyncPoResponse(outageId));
    }
    const url = `${this.baseUrl}/cfm-mise/cm-api/syncplannedoutage`;
    return this.http.post<SyncPoResponse>(url, payload, { headers: this.postHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS)
    );
  }

  // ---------- #7 Save PO Internal (post-create, fire-and-forget) ----------
  // POST {apiEndPoint}/cfm-mise/cm-api/changeid/savePOIDInternal
  // DJP never reads the response — mirrored exactly: no success/error
  // handling invented here, caller just fires it.
  savePoInternal(payload: any): Observable<PoInternalResponse> {
    if (this.useMock) { return of(getMockPoInternalResponse()); }
    const url = `${this.baseUrl}/cfm-mise/cm-api/changeid/savePOIDInternal`;
    return this.http.post<PoInternalResponse>(url, payload, { headers: this.postHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS),
      catchError(err => {
        console.warn('[ChangeManagementService] savePoInternal failed (fire-and-forget, DJP does not handle this either):', err);
        return of(null);
      })
    );
  }

  // ---------- #8 Update PO Internal (post-update, fire-and-forget) ----------
  // POST {apiEndPoint}/cfm-mise/cm-api/changeid/updatePOIDInternal
  updatePoInternal(payload: any): Observable<PoInternalResponse> {
    if (this.useMock) { return of(getMockPoInternalResponse()); }
    const url = `${this.baseUrl}/cfm-mise/cm-api/changeid/updatePOIDInternal`;
    return this.http.post<PoInternalResponse>(url, payload, { headers: this.postHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS),
      catchError(err => {
        console.warn('[ChangeManagementService] updatePoInternal failed (fire-and-forget, DJP does not handle this either):', err);
        return of(null);
      })
    );
  }

  // ---------- #9 Mail/Notify Outage ----------
  // POST {apiEndPoint}/cfm-mise/cm-api/mailplannedoutage
  mailOutage(payload: any): Observable<MailOutageResponse> {
    if (this.useMock) { return of(getMockMailOutageResponse()); }
    const url = `${this.baseUrl}/cfm-mise/cm-api/mailplannedoutage`;
    return this.http.post<MailOutageResponse>(url, payload, { headers: this.postHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS)
    );
  }

  // ---------- #10 Check Link Status ----------
  // GET {apiEndPoint}/cfm-mise/api/linkStatus?lsi=
  checkLinkStatus(lsi: string): Observable<LinkStatusResponse> {
    if (this.useMock) { return of(getMockLinkStatusResponse(lsi)); }
    const url = `${this.baseUrl}/cfm-mise/api/linkStatus?lsi=${encodeURIComponent(lsi)}`;
    return this.http.get<LinkStatusResponse>(url).pipe(
      timeout(this.REQUEST_TIMEOUT_MS)
    );
  }

  // ---------- Orchestration: Dashboard ----------
  // Mirrors DashboardComponent.getAllCRQData(): default window = last 24h,
  // filters out entries missing changeId/plannedOutageId, dedupes by the
  // (changeId, plannedOutageId) pair, reformats created_on by inserting a
  // 'T' at position 10 (matches DJP's own slice-based reformat exactly).
  // Never errors to the caller — falls back to mock, same as EM/IM.
  getDashboardData(fromDate?: string, toDate?: string): Observable<CmDashboardData> {
    if (this.useMock) { return of(getMockDashboardData()); }
    const from = fromDate || this.formatSiebelDateTime(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const to = toDate || this.formatSiebelDateTime(new Date());
    return this.getLiveCrqDataRaw(from, to).pipe(
      map(data => this.mapDashboardData(data)),
      catchError(err => {
        console.warn('[ChangeManagementService] Real API unreachable, falling back to mock dashboard data:', err);
        return of(getMockDashboardData());
      })
    );
  }

  // ---------- Orchestration: CRQ page ----------
  getCrqPageData(crqSearch?: string, poIdSearch?: string): Observable<CrqPageData> {
    if (this.useMock) {
      const { plannedOutages } = getMockCrqPageData();
      // CRQ/PO-id search is client-side-only in mock mode — the real
      // endpoint filters server-side, this mirrors that behavior locally
      // rather than always returning the full unfiltered list.
      const filtered = plannedOutages.filter(o =>
        (!crqSearch || o.crq.toLowerCase().includes(crqSearch.toLowerCase())) &&
        (!poIdSearch || o.outageId.toLowerCase().includes(poIdSearch.toLowerCase()))
      );
      return of({ plannedOutages: filtered });
    }
    const payload: any = {};
    if (crqSearch) { payload.crq = crqSearch; }
    if (poIdSearch) { payload.plannedOutageId = poIdSearch; }
    return this.getPlannedOutagesRaw(payload).pipe(
      map(rows => ({ plannedOutages: (rows || []).map(row => this.toPlannedOutage(row)) })),
      catchError(err => {
        console.warn('[ChangeManagementService] Real API unreachable, falling back to mock CRQ page data:', err);
        return of(getMockCrqPageData());
      })
    );
  }

  // ---------- Mapping helpers ----------

  private mapDashboardData(data: CrqLiveApiRow[] | CrqLiveApiRow): CmDashboardData {
    let validRows: CrqLiveApiRow[] = [];
    const rows = Array.isArray(data) ? data : [data];
    validRows = rows.filter(r => r?.changeId?.length > 0 && r?.plannedOutageId?.length > 0)
      .map(r => ({ ...r, created_on: this.reformatCreatedOn(r.created_on) }));
    // Dedupe by (changeId, plannedOutageId) — matches DJP exactly.
    validRows = validRows.filter((item, index, self) =>
      index === self.findIndex(t => t.changeId === item.changeId && t.plannedOutageId === item.plannedOutageId)
    );

    const changes: DashboardChangeRow[] = validRows.map(r => ({
      changeId: r.changeId,
      plannedOutageId: r.plannedOutageId,
      status: this.normalizeDashboardStatus(r.status),
      createdOn: r.created_on,
    }));

    const cardMeta: { key: string; label: string; viewText: string; color: string; bg: string; icon: string }[] = [
      { key: 'all', label: 'All Changes', viewText: 'View all changes', color: '#ed7199', bg: 'rgba(237, 113, 153, 0.08)', icon: '/assets/change-management/Icon-6.png' },
      { key: 'scheduled', label: 'Scheduled', viewText: 'View scheduled', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', icon: '/assets/change-management/Iconsch.png' },
      { key: 'rejected', label: 'Rejected', viewText: 'View rejected', color: '#e60012', bg: '#fef2f2', icon: '/assets/change-management/Icon-5.png' },
      { key: 'in-progress', label: 'In Progress', viewText: 'View in progress', color: '#4664aa', bg: 'rgba(70, 100, 170, 0.08)', icon: '/assets/change-management/Icon-4.png' },
      { key: 'completed', label: 'Completed', viewText: 'View completed', color: '#22c55e', bg: 'rgba(99, 205, 90, 0.08)', icon: '/assets/change-management/Icon-3.png' },
      { key: 'cancelled', label: 'Cancelled', viewText: 'View cancelled', color: '#ff9900', bg: 'rgba(255, 153, 0, 0.08)', icon: '/assets/change-management/Icon-2.png' },
    ];
    const keyToStatus: Record<string, DashboardChangeStatus> = {
      scheduled: 'Scheduled', rejected: 'Rejected', 'in-progress': 'In Progress',
      completed: 'Completed', cancelled: 'Cancelled',
    };
    const statCards: StatCard[] = cardMeta.map(meta => ({
      key: meta.key,
      label: meta.label,
      count: meta.key === 'all' ? changes.length : changes.filter(c => c.status === keyToStatus[meta.key]).length,
      viewText: meta.viewText,
      color: meta.color,
      bg: meta.bg,
      icon: meta.icon,
    }));

    return { statCards, changes };
  }

  // DJP's real status value for the "In Progress" card is the full phrase
  // "Implementation In Progress" (verified in dashboard.component.ts's
  // statusList), not "In Progress" — DJP-CFM's shorter label is normalized
  // to here so the card's client-side filter still matches real data.
  private normalizeDashboardStatus(status: string): DashboardChangeStatus {
    if (status?.toLowerCase() === 'implementation in progress') { return 'In Progress'; }
    return status as DashboardChangeStatus;
  }

  private reformatCreatedOn(value: string): string {
    if (!value || value.length < 10) { return value; }
    return value.trim().slice(0, 10) + 'T' + value.slice(10).trim();
  }

  private formatSiebelDateTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  private toPlannedOutage(row: PlannedOutageApiRow): PlannedOutage {
    const f = row.rawData || ({} as any);
    const lsiRaw = f['B2B Planned Outage LSI BC'];
    const lsiList = Array.isArray(lsiRaw) ? lsiRaw : lsiRaw ? [lsiRaw] : [];
    // Exact LSI-number field name within each linked-LSI object was never
    // confirmed in DJP's source (only "does at least one exist" was ever
    // read) — tries the plausible key, falls back to a JSON snippet rather
    // than silently dropping the value.
    const linkedLsis = lsiList.map((l: any) => l?.LSINumber || l?.['LSI Number'] || JSON.stringify(l));

    return {
      outageId: f['Planned Outage Id'] || '',
      crq: f['Request CRQ'] || '',
      changeType: f['Change Type'] || '',
      impact: f['Impact'] || '',
      status: f['Status'] || '',
      implementer: f['Implementer'] || '',
      description: f['Change Description'] || '',
      startDate: f['Planned Start Date'] || '',
      endDate: f['Planned End Date'] || '',
      reason: f['Outage Reason'] || '',
      submission: 'Submitted',
      rawData: f,
      linkedLsis,
    };
  }

  // Builds the exact Siebel-hierarchical payload #6 expects, from a
  // PlannedOutage — shared by both create (no Planned Outage Id) and update
  // (has one) since DJP's own syncPo is a single upsert endpoint for both.
  // MessageId "1-499KY" is DJP's own hardcoded literal, kept exactly as
  // found — see the service-level flag on why, not changed here.
  buildSyncPoPayload(fields: Partial<PlannedOutageSiebelFieldsInput>): any {
    return {
      body: {
        SiebelMessage: {
          IntObjectFormat: 'Siebel Hierarchical',
          MessageId: '1-499KY',
          IntObjectName: 'B2B Planned Outage IO',
          MessageType: 'Integration Object',
          'ListOfB2B Planned Outage IO': {
            'B2B Planned Outage BC': fields,
          },
        },
      },
    };
  }
}

// Loosely-typed input shape for buildSyncPoPayload — a Partial view of
// PlannedOutageSiebelFields plus the create-only "Request CRQ" field DJP's
// own submit() payload includes.
interface PlannedOutageSiebelFieldsInput {
  'Activity Location': string;
  'Benefit Of Change': string;
  Category: string;
  'Change Description': string;
  'Change Type': string;
  Impact: string;
  Implementer: string;
  'Request CRQ': string;
  'Duration in Min': string;
  'Outage Reason': string;
  'Planned End Date': string;
  'Planned Start Date': string;
  'Requester Email Id': string;
  'Type of Change': string;
  'Reference Number': string;
  'Planned Outage Id': string;
  Status: string;
}
