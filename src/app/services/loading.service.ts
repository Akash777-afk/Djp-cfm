import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Global, app-wide loading state for the full-screen Airtel-branded overlay
// (see shared/loading-overlay). Reference-counted rather than a plain
// boolean: a page's dashboard load can fan out into several concurrent
// requests (forkJoin'd calls, per-row N+1 fetches, an unrelated second
// action firing while the first hasn't settled yet, etc.) — with a plain
// boolean, whichever one finishes first would hide the overlay while the
// others are still in flight. show()/hide() must be called in matching
// pairs; the overlay only actually hides once every outstanding show() has
// a matching hide().
//
// Callers don't need to change how they already track their own
// component-level isLoading flag — this is meant to be called *alongside*
// the existing `isLoading = true/false` lines already bracketing each real
// API call, not to replace that state or the call itself.
@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private counter = 0;
  private readonly visibleSubject = new BehaviorSubject<boolean>(false);
  readonly visible$: Observable<boolean> = this.visibleSubject.asObservable();

  show(): void {
    this.counter++;
    if (this.counter === 1) {
      this.visibleSubject.next(true);
    }
  }

  hide(): void {
    if (this.counter === 0) {
      // Defensive: a stray/unmatched hide() shouldn't be able to push the
      // counter negative and silently break the next real show()/hide() pair.
      return;
    }
    this.counter--;
    if (this.counter === 0) {
      this.visibleSubject.next(false);
    }
  }
}
