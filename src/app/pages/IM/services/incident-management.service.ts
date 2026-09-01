import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { StatTile } from '../components/nstt-status/nstt-status.component';
import { NsttChildSr, NsttRow } from '../components/all-nstts/all-nstts.component';
import { DEFAULT_BINS, TILE_CHROME } from '../incident-management.constants';
import { getMockDashboardData } from './incident-management.mock';
import {
  ColumnPreferencesGetResponse, ColumnPreferencesPayload, ColumnPreferencesUpdateResponse,
  EscalatedSrApiResponse, IncidentDashboardApiResponse, IncidentDashboardData, NsttApiRow, SrDetailForNstt,
} from './incident-management.types';

@Injectable({
  providedIn: 'root'
})
export class IncidentManagementService {

  constructor(private http: HttpClient) {}

  private readonly baseUrl = environment.apiEndPoint;

  // GET calls use httpOptionsGet's header set (Content-Type + CORS +
  // hardcoded Basic-Auth token — same one documented/flagged in the EM
  // reference); fetchNSTTDetails and fetchSrPendencyStatus are POSTs but DJP
  // sends them with this same "Get" header object regardless, so reproduced
  // as-is rather than "corrected" to the Post variant.
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

  private readonly REQUEST_TIMEOUT_MS = 20000;

  // POST {apiEndPoint}/cfm-mise/im/fetchNSTTDetails
  // No client-side timeout here on purpose — matches DJP's own
  // getImSrlist() (dashboard.service.ts), which has no timeout at all on
  // this call. Confirmed via live VPN testing: this endpoint legitimately
  // takes longer than the 20s this used to be capped at (DJP itself just
  // waits it out; DJP-CFM's old timeout(20000) was canceling the request
  // before the real backend ever got to respond). catchError/mock fallback
  // still applies at the getDashboardData() level below on genuine errors.
  private getNsttListRaw(binNames: string[]): Observable<IncidentDashboardApiResponse> {
    const url = `${this.baseUrl}/cfm-mise/im/fetchNSTTDetails`;
    return this.http.post<IncidentDashboardApiResponse>(url, { 'Bin Names': binNames }, { headers: this.getHeaders });
  }

  // GET {apiEndPoint}/cfm-mise/djp/getLSIByNSTT?nstt=...
  private getLsiListRaw(nstt: string): Observable<string[]> {
    const url = `${this.baseUrl}/cfm-mise/djp/getLSIByNSTT?nstt=${encodeURIComponent(nstt)}`;
    return this.http.get<string[]>(url).pipe(timeout(this.REQUEST_TIMEOUT_MS));
  }

  // POST {apiEndPoint}/cfm-mise/djp/fetchSrPendencyStatus
  // DOES get a client-side timeout, unlike getNsttListRaw above: confirmed
  // via live testing that an unscoped call (empty OLM ID, which happens
  // whenever the cp-rest/security/user lookup hasn't resolved yet or 401s
  // outside the real portal) can hang indefinitely with no server-side
  // error to catch — catchError alone never fires for a request that's
  // simply never answered. The catchError in getDashboardData() below
  // (falls back to an empty 'All Tasks' list) now also covers this timeout.
  private getEscalatedSrsRaw(olmId: string): Observable<EscalatedSrApiResponse> {
    const url = `${this.baseUrl}/cfm-mise/djp/fetchSrPendencyStatus`;
    const payload = { 'OLM ID': olmId || '', 'Bin Names': ['ES_IM ENGINEER'] };
    return this.http.post<EscalatedSrApiResponse>(url, payload, { headers: this.postHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS)
    );
  }

  // POST {apiEndPoint}/cfm-mise/djp/fetchUserColumnList
  getColumnPreferences(olmId: string): Observable<Record<string, 'Y' | 'N'> | null> {
    const url = `${this.baseUrl}/cfm-mise/djp/fetchUserColumnList`;
    const payload: ColumnPreferencesPayload = { olmId, type: 'nstt_column_list' };
    return this.http.post<ColumnPreferencesGetResponse>(url, payload, { headers: this.postHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS),
      map(res => res?.columnNameValues || null),
      catchError(err => {
        console.warn('[IncidentManagementService] getColumnPreferences failed:', err);
        return of(null);
      })
    );
  }

  // POST {apiEndPoint}/cfm-mise/djp/UpdateUserColumnList
  // Success convention here is {status: 'Success'} — NOT {Code:'000'} like
  // most other djp-mise endpoints. Checked explicitly by the caller against
  // that exact field, not assumed.
  updateColumnPreferences(olmId: string, columnNameValues: Record<string, 'Y' | 'N'>): Observable<ColumnPreferencesUpdateResponse> {
    const url = `${this.baseUrl}/cfm-mise/djp/UpdateUserColumnList`;
    const payload: ColumnPreferencesPayload = { olmId, type: 'nstt_column_list', columnNameValues };
    return this.http.post<ColumnPreferencesUpdateResponse>(url, payload, { headers: this.postHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS)
    );
  }

  // Orchestrates the full dashboard load, mirroring
  // ImDashboardUiComponent.getImSrList():
  //   1. fetch the NSTT list for the selected bins
  //   2. build the 8 stat tiles from the response's own "Count of X" fields
  //      (authoritative counts — not recomputed from the row list, matching
  //      DJP's own behavior)
  //   3. for each NSTT row, fetch its unique LSI list (dependent N+1 call —
  //      surfaced in the expand-to-drawer view, not a new table column, to
  //      avoid changing the fixed-pixel table layout)
  //   4. fetch the escalated-SR count independently (not dependent on #1)
  //   5. compute ageing + owner display client-side, same formulas as DJP
  //
  // Never errors to the caller — falls back to mock data (with a console
  // warning) exactly like EscalationMatrixService, since the real backend is
  // unreachable from this dev environment.
  getDashboardData(binNames: string[] = DEFAULT_BINS, olmId: string = ''): Observable<IncidentDashboardData> {
    return forkJoin({
      nstt: this.getNsttListRaw(binNames),
      escalated: this.getEscalatedSrsRaw(olmId).pipe(
        catchError(err => {
          console.warn('[IncidentManagementService] getEscalatedSrsRaw failed:', err);
          return of({ 'All Tasks': [] } as EscalatedSrApiResponse);
        })
      ),
    }).pipe(
      switchMap(({ nstt, escalated }) => {
        const allRows = nstt['List of NSTT and NSTT details'] || [];
        if (allRows.length === 0) {
          return of({ nstt, escalated, lsiByNstt: {} as Record<string, string[]> });
        }
        return forkJoin(
          allRows.map(row =>
            this.getLsiListRaw(row.NSTT).pipe(
              catchError(err => {
                console.warn(`[IncidentManagementService] getLSIByNSTT failed for ${row.NSTT}:`, err);
                return of([] as string[]);
              })
            )
          )
        ).pipe(map(lsiLists => {
          const lsiByNstt: Record<string, string[]> = {};
          allRows.forEach((row, i) => { lsiByNstt[row.NSTT] = lsiLists[i]; });
          return { nstt, escalated, lsiByNstt };
        }));
      }),
      map(({ nstt, escalated, lsiByNstt }) => this.mapToDashboardData(nstt, escalated, lsiByNstt)),
      catchError(err => {
        console.warn('[IncidentManagementService] Real API unreachable, falling back to mock dashboard data:', err);
        return of(getMockDashboardData());
      })
    );
  }

  // ---------- Mapping helpers ----------

  private mapToDashboardData(
    nstt: IncidentDashboardApiResponse,
    escalated: EscalatedSrApiResponse,
    lsiByNstt: Record<string, string[]>,
  ): IncidentDashboardData {
    const allRows = nstt['List of NSTT and NSTT details'] || [];
    const nsttRows: NsttRow[] = allRows.map(row => this.toNsttRow(row, lsiByNstt[row.NSTT] || []));

    const escalatedCount = this.countEscalated(escalated);
    const statTiles = this.buildStatTiles(nstt, escalatedCount);
    const groupOptions = nstt['assigned group']?.filter(g => g) || [];

    return { statTiles, nsttRows, groupOptions };
  }

  private toNsttRow(row: NsttApiRow, lsiList: string[]): NsttRow {
    // DJP never trusts the raw 'SR details for each NSTT' list as-is — every
    // call site in ImDashboardUiComponent runs it through getUniqueSrDetails()
    // first, then recomputes 'SR count' as that deduped list's length (not
    // the raw response field). Reproduced here rather than mapping the raw
    // array straight through, since the real response can carry duplicate/
    // 'Customer Update Task' rows per SR that would otherwise inflate the
    // count and produce duplicate child-SR rows in the drawer.
    const children = this.dedupeSrDetails(row['SR details for each NSTT'] || []);
    return {
      vipType: row.VIPFlag === 'Y' ? 'diamond' : 'account',
      nstt: row.NSTT,
      nsttAgeing: this.computeAgeing(row['Actual Incident Time'], row['Up Time']),
      site: row.Site,
      status: row.Status,
      actualIncidentTime: row['Actual Incident Time'],
      assignedGroup: row['Assigned Group'],
      lastErtTime: row['Last ERT Time'] || '',
      upTime: row['Up Time'],
      srCount: children.length,
      srDetails: children.map(sr => ({
        srNumber: sr['SR Number'],
        lsiNumber: sr['LSI Number'] || '',
        owner: sr['TAC1 Current Owner OLM ID'] || '',
        sla: sr['SR SLA'] || '',
        outcome: sr['Outcome'] || '',
      })),
      nsttOwner: this.deriveOwner(children),
      uniqueLsiCount: lsiList.length,
    };
  }

  // Matches DJP's getUniqueSrDetails() exactly: for each entry, look up the
  // first index (in original order) of an entry sharing its SR Number whose
  // Task Name isn't 'Customer Update Task' — keep the entry only if that's
  // its own index. Net effect: keeps the first real-task occurrence of each
  // SR Number; 'Customer Update Task' rows are always dropped, duplicates
  // of a SR Number are always dropped.
  private dedupeSrDetails(details: SrDetailForNstt[]): SrDetailForNstt[] {
    return details.filter((item, index, self) =>
      self.findIndex(t => t['SR Number'] === item['SR Number'] && t['Task Name'] !== 'Customer Update Task') === index
    );
  }

  // Matches DJP's fetchNSTTOwnerData(): a single shared owner across every
  // child SR shows that owner; anything else (multiple owners, none at all)
  // shows "Update" as a prompt to assign one — same simplified rule, without
  // DJP's tooltip breakdown (that's presentation detail, not the API contract).
  private deriveOwner(children: { 'TAC1 Current Owner OLM ID'?: string }[]): string {
    const owners = Array.from(new Set(children.map(c => c['TAC1 Current Owner OLM ID']).filter(o => o)));
    return owners.length === 1 ? owners[0]! : 'Update';
  }

  // Matches DJP's timeDiffCalc()/secondsToHMS(): elapsed time between Actual
  // Incident Time and Up Time (or now, if not yet up), formatted HH:MM:SS.
  private computeAgeing(actualIncidentTime: string, upTime: string): string {
    const start = new Date(actualIncidentTime);
    const end = upTime ? new Date(upTime) : new Date();
    if (isNaN(start.getTime())) { return ''; }
    const diffSeconds = Math.abs(end.getTime() - start.getTime()) / 1000;
    const pad = (n: number) => (n < 10 ? '0' : '') + n;
    const h = Math.floor(diffSeconds / 3600);
    const m = Math.floor((diffSeconds % 3600) / 60);
    const s = Math.round(diffSeconds % 60);
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  private countEscalated(escalated: EscalatedSrApiResponse): number {
    const tasks = escalated?.['All Tasks'] || [];
    // Dedupe by SR Number keeping the newest Task Creation Time, then keep
    // only entries with a non-empty B2BEscalationNotes — matches
    // ImDashboardUiComponent.getAllSRDetailsFromAllTasks() exactly.
    const bySr = new Map<string, typeof tasks[0]>();
    for (const t of tasks) {
      const existing = bySr.get(t['SR Number']);
      if (!existing || new Date(t['Task Creation Time']).getTime() > new Date(existing['Task Creation Time']).getTime()) {
        bySr.set(t['SR Number'], t);
      }
    }
    return Array.from(bySr.values()).filter(t => t.B2BEscalationNotes && t.B2BEscalationNotes.length > 0).length;
  }

  private buildStatTiles(nstt: IncidentDashboardApiResponse, escalatedCount: number): StatTile[] {
    const countByKey: Record<string, number> = {
      all: nstt['Count of total NSTTs'] ?? 0,
      'in-progress': nstt['Count of In Progress NSTTs'] ?? 0,
      assigned: nstt['Count of Assigned NSTTs'] ?? 0,
      escalated: escalatedCount,
      resolved: nstt['Count of Resolved/Resolved by Netcool NSTTs'] ?? 0,
      closed: nstt['Count of Closed NSTTs'] ?? 0,
      cancelled: nstt['Count of Cancelled NSTTs'] ?? 0,
      unknown: nstt['Count of Unknown NSTTs'] ?? 0,
    };
    const labels: Record<string, string> = {
      all: 'All Tasks', 'in-progress': 'In Progress', assigned: 'Assigned', escalated: 'Escalated',
      resolved: 'Resolved', closed: 'Closed', cancelled: 'Cancelled', unknown: 'Unknown',
    };
    return Object.keys(TILE_CHROME).map(key => {
      const value = countByKey[key] ?? 0;
      return {
        key,
        label: labels[key],
        value: String(value),
        ...TILE_CHROME[key],
      };
    });
  }
}
