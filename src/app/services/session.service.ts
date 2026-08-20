import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ActivityLogPayload, RedirectionUrls, UserDataModel } from './session.types';

// Minimal app-shell session layer, scoped to exactly what Escalation Matrix
// needs today (real username for activity logging / welcome text) — NOT a
// full port of DJP's AppService.fetchInitialData() (login-gating,
// sessionStorage flags, NOC/IM redirection URLs, etc.). Extend this rather
// than duplicating it if a later module needs more of that.
//
// Endpoint/contract source: djp/EscalationMatrix/src/app/services/app.service.ts
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private http: HttpClient) {}

  // GET {tierOneEndPoint}/cp-rest/security/user — DJP calls this with the
  // plain HttpClient and NO explicit headers (see AppService.getUserDetails,
  // which has a "FOR WORKING LOCALLY" comment implying it relies on an
  // ambient session/cookie from the tier-one portal rather than an explicit
  // Authorization header). Reproduced exactly: no headers added here either.
  //
  // Cached for the session (shareReplay) since DJP itself treats this as a
  // one-time bootstrap call, not something re-fetched per page.
  private cachedUser$: Observable<UserDataModel> | null = null;

  getCurrentUser(): Observable<UserDataModel> {
    if (!this.cachedUser$) {
      this.cachedUser$ = this.http.get<UserDataModel>(`${environment.tierOneEndPoint}/cp-rest/security/user`).pipe(
        shareReplay(1),
        catchError(err => {
          // Backend unreachable from this dev environment (internal-only
          // host) — don't cache the failure, so a later real deployment can
          // still succeed on retry; callers fall back to their own default.
          console.warn('[SessionService] getCurrentUser failed, falling back to default user context:', err);
          this.cachedUser$ = null;
          return of({} as UserDataModel);
        })
      );
    }
    return this.cachedUser$;
  }

  // POST {apiEndPoint}/cfm-mise/djp/activityLog — matches
  // AppService.monitorActivity() exactly: same URL, same header set
  // (Content-Type + CORS, no Authorization), same "swallow errors, just
  // console.error" behavior (fire-and-forget audit call, must never block
  // the UI it's attached to). CONFIRMED via live VPN testing (404 on
  // broadcastURL) — monitorActivity() actually builds its URL from the raw
  // environment.apiEndPoint import, not environment.broadcastURL.
  private readonly postHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  });

  logActivity(payload: ActivityLogPayload): Observable<any> {
    const url = `${environment.apiEndPoint}/cfm-mise/djp/activityLog`;
    return this.http.post(url, payload, { headers: this.postHeaders }).pipe(
      catchError(err => {
        console.error('[SessionService] Error logging activity:', err);
        return of(null);
      })
    );
  }

  // GET {broadcastURL}/cfm-mise/djp/getUrl — AppService.getHyperLinkNavurls().
  // This is the one method in DJP's AppService that genuinely uses
  // environment.broadcastURL (via this.apiEndPoint) rather than the raw
  // environment.apiEndPoint import — see the base-URL note on EscalationMatrixService.
  // Added for Incident Management's broadcast-call icon; EM didn't need this
  // one so it wasn't built until now — this is the "extend, don't duplicate"
  // case the class comment above already anticipated.
  private cachedRedirectionUrls$: Observable<RedirectionUrls> | null = null;

  getHyperLinkNavurls(): Observable<RedirectionUrls> {
    if (!this.cachedRedirectionUrls$) {
      const url = `${environment.broadcastURL}/cfm-mise/djp/getUrl`;
      this.cachedRedirectionUrls$ = this.http.get<RedirectionUrls>(url, { headers: this.getHeaders }).pipe(
        shareReplay(1),
        catchError(err => {
          console.warn('[SessionService] getHyperLinkNavurls failed:', err);
          this.cachedRedirectionUrls$ = null;
          return of(null as any);
        })
      );
    }
    return this.cachedRedirectionUrls$;
  }

  // Matches AppService.httpOptionsGet exactly (Content-Type + CORS + the
  // same hardcoded Basic-Auth token documented in the EM reference).
  private readonly getHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    Authorization: 'Basic Q0ZNVVNFUjpjdWJhc3Rpb25AMTIz',
  });
}
