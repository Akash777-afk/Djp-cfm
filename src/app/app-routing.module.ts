import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';
import { IncidentManagementComponent } from './pages/incident-management/incident-management.component';
import { ChangeManagementComponent } from './pages/change-management/change-management.component';
import { EscalationMatrixComponent } from './pages/escalation-matrix/escalation-matrix.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'incident-management',
    component: IncidentManagementComponent
  },
  {
    path: 'change-management',
    component: ChangeManagementComponent
  },
  {
    path: 'escalation-matrix',
    component: EscalationMatrixComponent
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