import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { IncidentManagementComponent } from './pages/incident-management/incident-management.component';
import { ChangeManagementComponent } from './pages/change-management/change-management.component';
import { EscalationMatrixComponent } from './pages/escalation-matrix/escalation-matrix.component';
import { HeaderPartComponent } from './pages/landing/components/header-part/header-part.component';
import { ColorfulTilesComponent } from './pages/landing/components/colorful-tiles/colorful-tiles.component';
import { AnalyticsOverviewComponent } from './pages/landing/components/analytics-overview/analytics-overview.component';
import { SrOverviewComponent } from './pages/landing/components/sr-overview/sr-overview.component';
import { EscalationMatrixCardComponent } from './pages/landing/components/escalation-matrix/escalation-matrix.component';
import { IncidentManagementCardComponent } from './pages/landing/components/incident-management/incident-management.component';
import { ChangeManagementCardComponent } from './pages/landing/components/change-management/change-management.component';
import { SidebarNavComponent } from './pages/incident-management/components/sidebar-nav/sidebar-nav.component';
import { TopBarComponent } from './pages/incident-management/components/top-bar/top-bar.component';
import { NsttStatusComponent } from './pages/incident-management/components/nstt-status/nstt-status.component';
import { AllNsttsComponent } from './pages/incident-management/components/all-nstts/all-nstts.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    IncidentManagementComponent,
    ChangeManagementComponent,
    EscalationMatrixComponent,
    HeaderPartComponent,
    ColorfulTilesComponent,
    AnalyticsOverviewComponent,
    SrOverviewComponent,
    EscalationMatrixCardComponent,
    IncidentManagementCardComponent,
    ChangeManagementCardComponent,
    SidebarNavComponent,
    TopBarComponent,
    NsttStatusComponent,
    AllNsttsComponent
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