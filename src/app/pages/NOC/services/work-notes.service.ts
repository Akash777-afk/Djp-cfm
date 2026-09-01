import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WorkNote } from '../components/work-notes/work-notes.component';
import { MOCK_WORK_NOTES } from './work-notes.mock';

// Same shape/rationale as SrDetailsService: an Observable-returning method
// so the consumer (WorkNotesComponent) already looks like it's talking to a
// real endpoint. Swapping to a real API later is a one-line change *inside
// this method only*:
//   getWorkNotes(): Observable<WorkNote[]> {
//     return this.http.get<WorkNote[]>('/api/work-notes');
//   }
@Injectable({
  providedIn: 'root'
})
export class WorkNotesService {

  getWorkNotes(): Observable<WorkNote[]> {
    return of(MOCK_WORK_NOTES);
  }
}
