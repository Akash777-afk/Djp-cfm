import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { getMockHealthIndexData, HealthIndexData } from './health-index.mock';

// Same shape/rationale as SrSummaryService/WorkNotesService: an
// Observable-returning method, so NocHealthIndexComponent already looks
// like it's talking to a real endpoint. No real LSI Health Index API exists
// yet anywhere in this codebase to call — swapping to one later is a
// one-line change *inside this method only*, matching every other
// module's real-API-with-mock-fallback pattern (e.g.
// IncidentManagementService.getDashboardData()):
//   getHealthIndexData(): Observable<HealthIndexData> {
//     return this.http.get<HealthIndexData>(`${this.baseUrl}/cfm-mise/.../lsiHealthIndex`).pipe(
//       timeout(this.REQUEST_TIMEOUT_MS),
//       catchError(err => { console.warn(...); return of(getMockHealthIndexData()); })
//     );
//   }
@Injectable({
  providedIn: 'root'
})
export class HealthIndexService {

  getHealthIndexData(): Observable<HealthIndexData> {
    return of(getMockHealthIndexData());
  }
}
