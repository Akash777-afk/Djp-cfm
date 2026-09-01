import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SrSummaryData } from '../components/sr-summary/sr-summary.component';
import { MOCK_SR_SUMMARY } from './sr-summary.mock';

// Same shape/rationale as SrDetailsService/WorkNotesService: an
// Observable-returning method keyed off the searched SR number, so the
// consumer (SrSummaryComponent) already looks like it's talking to a real
// endpoint. Swapping to a real API later is a one-line change *inside this
// method only*:
//   getSrSummary(srNumber: string): Observable<SrSummaryData> {
//     return this.http.get<SrSummaryData>(`/api/sr/${srNumber}/summary`);
//   }
@Injectable({
  providedIn: 'root'
})
export class SrSummaryService {

  getSrSummary(srNumber: string): Observable<SrSummaryData> {
    return of(MOCK_SR_SUMMARY);
  }
}
