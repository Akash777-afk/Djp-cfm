import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';
import { ChangeManagementLandingComponent } from './pages/change-management/landing/change-management-landing.component';
import { ChangeManagementCrqComponent } from './pages/change-management/crq/change-management-crq.component';
import { IncidentManagementComponent } from './pages/incident-management/incident-management.component';
import { EscalationMatrixComponent } from './pages/escalation-matrix/escalation-matrix.component';
import { NocPortalComponent } from './pages/noc-portal/noc-portal.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'change-management',
    component: ChangeManagementLandingComponent
  },
  {
    path: 'change-management/crq',
    component: ChangeManagementCrqComponent
  },
  {
    path: 'incident-management',
    component: IncidentManagementComponent
  },
  {
    path: 'escalation-matrix',
    component: EscalationMatrixComponent
  },
  {
    path: 'noc-portal',
    component: NocPortalComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  // scrollPositionRestoration: 'top' — global, router-level fix rather than
  // per-page logic: Angular's router remembers each URL's last scroll
  // position by default (so browser back/forward feels natural), which is
  // exactly what was showing up as "IM loads already scrolled down" —
  // navigating to a route the user had previously scrolled on restored
  // that old position instead of starting fresh. 'top' resets to (0, 0) on
  // every successful navigation instead, covering all current and future
  // routes with no per-component code.
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}