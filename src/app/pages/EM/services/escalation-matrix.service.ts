import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, switchMap, timeout } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { EscalationLevelTile } from '../components/escalation-levels/escalation-levels.component';
import { EscalatedSrRow, SrType } from '../components/escalated-srs/escalated-srs.component';
import { COUNT_TILE_COLOR, hexToRgba, LEVEL_COLORS, LEVEL_ICONS, levelColorRgba } from '../escalation-matrix.constants';
import { getMockDashboardData } from './escalation-matrix.mock';
import { CallHistoryCounts, EscalationApiRow, EscalationDashboardData } from './escalation-matrix.types';

// Real API integration for the Escalation Matrix dashboard. Endpoint/header/
// response contract source: djp/EscalationMatrix/src/app/services/app.service.ts
// (getAllEscalationsData, getCallHistoryCounts) and
// djp/EscalationMatrix/src/app/components/dashboard/dashboard/dashboard.component.ts
// (client-side grouping/sort/tile-count logic — there is no server-side
// pagination/sort/filter in this API, so none is invented here either).
//
// CONFIRMED via live VPN testing (404s on broadcastURL) + source re-check:
// AppService.apiEndPoint is assigned from environment.broadcastURL in its
// constructor, but fetchEscalationsHistory and getEscalationsCallCount
// (both used here) actually build their URL from the raw environment.
// apiEndPoint import, not that field — the constructor assignment is dead
// for these two calls. Fixed here to match what DJP's code actually does,
// not what its field name implied.
@Injectable({
  providedIn: 'root'
})
export class EscalationMatrixService {

  constructor(private http: HttpClient) {}

  private readonly baseUrl = environment.apiEndPoint;

  // Matches AppService.httpOptionsGet exactly (Content-Type + CORS headers +
  // a hardcoded Basic-Auth token). This token is a real weakness in DJP's own
  // code (a secret checked into source) — reproduced as-is because the
  // backend contract requires it, not because it's good practice; centralized
  // here as a named constant rather than a magic string, and should be the
  // first thing swapped for real credential handling once that exists.
  private readonly getHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    Authorization: 'Basic Q0ZNVVNFUjpjdWJhc3Rpb25AMTIz',
  });

  private readonly REQUEST_TIMEOUT_MS = 20000;

  // GET {broadcastURL}/cfm-mise/fac-api/fetchEscalationsHistory?status=Open
  private getAllEscalationsRaw(): Observable<EscalationApiRow[]> {
    const url = `${this.baseUrl}/cfm-mise/fac-api/fetchEscalationsHistory?status=Open`;
    return this.http.get<EscalationApiRow[]>(url, { headers: this.getHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS)
    );
  }

  // GET {broadcastURL}/cfm-mise/fac-api/getEscalationsCallCount?srNumber=...
  private getCallHistoryCountsRaw(srNumber: string): Observable<CallHistoryCounts> {
    const url = `${this.baseUrl}/cfm-mise/fac-api/getEscalationsCallCount?srNumber=${encodeURIComponent(srNumber)}`;
    return this.http.get<CallHistoryCounts>(url, { headers: this.getHeaders }).pipe(
      timeout(this.REQUEST_TIMEOUT_MS)
    );
  }

  // Orchestrates the full dashboard load exactly like DJP's
  // dashboard.component.ts.getAllEscalationsData() does client-side:
  //   1. group the raw list by SR_Number, keep only the max-Requested_Level
  //      entry per group
  //   2. sort the deduped list descending by Created_on
  //   3. for each distinct SR, fetch its per-level call-history counts
  //      (dependent N+1 calls — same pattern as DJP, not something to
  //      "optimize away" since that's the real contract)
  //   4. derive the level tiles' counts from the deduped rows' levels
  //
  // Never errors to the caller — falls back to mock data (with a console
  // warning) so the page still demos when the backend is unreachable, which
  // it is from this dev environment (internal-only hosts). The real request
  // still fires every time, so its shape can be verified via the network tab
  // regardless of whether it succeeds.
  getDashboardData(): Observable<EscalationDashboardData> {
    return this.getAllEscalationsRaw().pipe(
      map(rows => this.dedupeByMaxLevel(rows)),
      switchMap(dedupedRows => {
        if (dedupedRows.length === 0) {
          return of({ srRows: [] as EscalatedSrRow[], dedupedRows });
        }
        return forkJoin(
          dedupedRows.map(row =>
            this.getCallHistoryCountsRaw(row.SR_Number).pipe(
              catchError(err => {
                // One SR's count call failing shouldn't blank the whole
                // table — matches DJP's own per-row independence (each
                // getCallHistoryCounts call is a separate subscription).
                console.warn(`[EscalationMatrixService] getEscalationsCallCount failed for SR ${row.SR_Number}:`, err);
                return of({} as CallHistoryCounts);
              })
            )
          )
        ).pipe(map(countsList => ({
          srRows: dedupedRows.map((row, i) => this.toEscalatedSrRow(row, countsList[i])),
          dedupedRows,
        })));
      }),
      map(({ srRows, dedupedRows }) => ({
        srRows,
        levelTiles: this.buildLevelTiles(dedupedRows),
      })),
      catchError(err => {
        console.warn('[EscalationMatrixService] Real API unreachable, falling back to mock dashboard data:', err);
        return of(getMockDashboardData());
      })
    );
  }

  // ---------- Mapping helpers ----------

  private dedupeByMaxLevel(rows: EscalationApiRow[]): EscalationApiRow[] {
    const bySr = new Map<string, EscalationApiRow>();
    for (const row of rows || []) {
      const existing = bySr.get(row.SR_Number);
      if (!existing || row.Requested_Level > existing.Requested_Level) {
        bySr.set(row.SR_Number, row);
      }
    }
    return Array.from(bySr.values()).sort((a, b) => this.parseDate(b.Created_on) - this.parseDate(a.Created_on));
  }

  private parseDate(value: string): number {
    const t = Date.parse(value);
    return isNaN(t) ? 0 : t; // unparseable dates sink to the bottom rather than crashing the sort
  }

  private toEscalatedSrRow(row: EscalationApiRow, counts: CallHistoryCounts): EscalatedSrRow {
    const levelCounts = [
      counts.level1_Count || 0, counts.level2_Count || 0, counts.level3_Count || 0,
      counts.level4_Count || 0, counts.level5_Count || 0, counts.level6_Count || 0,
    ];
    return {
      srNumber: row.SR_Number,
      lsi: row.LSI,
      factory: row.Factory,
      circle: row.Circle,
      cluster: row.Cluster,
      customer: row.Customer_Name,
      level: row.Requested_Level,
      srType: this.normalizeSrType(row.Call_TRACKING),
      // Sum of all 6 per-level counts — default chosen because the table's
      // "Sr counts" column is a single number and DJP's own count API
      // returns a 6-way breakdown; open to changing to a single level's
      // count if that turns out to match DJP's own (unbuilt-in-djp-cfm)
      // Matrix Config screen expectations better.
      srCounts: levelCounts.reduce((sum, c) => sum + c, 0),
      escalatedTime: row.Created_on,
      // The individual 6 values, preserved rather than only summed above —
      // feeds the Call Escalation Tracking column's 6 boxes directly from
      // the same real API response, no separate/duplicate call.
      levelCounts,
    };
  }

  private normalizeSrType(value?: string): SrType {
    const known: SrType[] = ['Parent', 'Child', 'Escalated'];
    const match = known.find(t => t.toLowerCase() === (value || '').toLowerCase());
    if (!match && value) {
      console.warn(`[EscalationMatrixService] Unrecognized Call_TRACKING value "${value}", defaulting SR type to "Escalated"`);
    }
    return match || 'Escalated';
  }

  private buildLevelTiles(dedupedRows: EscalationApiRow[]): EscalationLevelTile[] {
    const countByLevel: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    for (const row of dedupedRows) {
      if (countByLevel[row.Requested_Level] !== undefined) { countByLevel[row.Requested_Level]++; }
    }
    const total = dedupedRows.length;
    const tiles: EscalationLevelTile[] = [
      { key: 'all', label: 'Total Count', value: total, accent: COUNT_TILE_COLOR, bg: hexToRgba(COUNT_TILE_COLOR, 0.08), icon: '/assets/escalation-matrix/Allcount.svg', filledDots: 0, pillText: 'All Escalated SRs' },
    ];
    for (let level = 1; level <= 6; level++) {
      tiles.push({
        key: `level-${level}`,
        label: `Level ${level}`,
        value: countByLevel[level],
        accent: LEVEL_COLORS[level],
        bg: levelColorRgba(level, 0.06),
        icon: LEVEL_ICONS[level],
        filledDots: level,
      });
    }
    return tiles;
  }
}
