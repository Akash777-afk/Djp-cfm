import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { IncidentManagementComponent } from './pages/incident-management/incident-management.component';
import { ChangeManagementComponent } from './pages/change-management/change-management.component';
import { EscalationMatrixComponent } from './pages/escalation-matrix/escalation-matrix.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    IncidentManagementComponent,
    ChangeManagementComponent,
    EscalationMatrixComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }