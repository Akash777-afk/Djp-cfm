import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SrDetails } from '../noc-portal.types';
import { MOCK_SR_DETAILS } from './sr-details.mock';

// Single source of truth for the SR Details state's backend-driven sections
// (Crystalized RCA Conclusion, SR Insights — more to come, see SrDetails'
// own comment). Returns an Observable so the caller (NocPortalComponent)
// already looks exactly like it's consuming a real endpoint.
//
// Swapping to a real API is a one-line change *inside this method only*:
//   getSrDetails(srNumber: string): Observable<SrDetails> {
//     return this.http.get<SrDetails>(`/api/sr/${srNumber}/details`);
//   }
// (plus injecting HttpClient and adding HttpClientModule to app.module.ts —
// neither of which exists in this app yet). Nothing in noc-portal.component.ts
// or the templates needs to change either way.
@Injectable({
  providedIn: 'root'
})
export class SrDetailsService {

  getSrDetails(srNumber: string): Observable<SrDetails> {
    return of(MOCK_SR_DETAILS);
  }
}
