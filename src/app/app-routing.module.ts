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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}