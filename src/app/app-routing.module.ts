import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LandingComponent } from './pages/landing/landing.component';
import { ChangeManagementLandingComponent } from './pages/change-management/landing/change-management-landing.component';
import { ChangeManagementCrqComponent } from './pages/change-management/crq/change-management-crq.component';
import { IncidentManagementComponent } from './pages/incident-management/incident-management.component';

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
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}