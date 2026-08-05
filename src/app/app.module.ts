import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { SrOverviewComponent } from './pages/landing/components/sr-overview/sr-overview.component';
import { IncidentManagementCardComponent } from './pages/landing/components/incident-management/incident-management.component';
import { ChangeManagementCardComponent } from './pages/landing/components/change-management/change-management.component';
import { EscalationMatrixCardComponent } from './pages/landing/components/escalation-matrix/escalation-matrix.component';
import { ChangeManagementLandingComponent } from './pages/change-management/landing/change-management-landing.component';
import { ChangeManagementLandingTopBarComponent } from './pages/change-management/landing/components/top-bar/top-bar.component';
import { ChangeManagementLandingStatCardsComponent } from './pages/change-management/landing/components/stat-cards/stat-cards.component';
import { ChangeManagementLandingChangesPanelComponent } from './pages/change-management/landing/components/changes-panel/changes-panel.component';
import { ChangeManagementCrqComponent } from './pages/change-management/crq/change-management-crq.component';
import { CrqPlannedOutagesComponent } from './pages/change-management/crq/components/crq-planned-outages/crq-planned-outages.component';
import { PlannedOutageInputComponent } from './pages/change-management/crq/components/planned-outage-input/planned-outage-input.component';
import { ChangeManagementSidebarNavComponent } from './pages/change-management/shared/sidebar-nav/sidebar-nav.component';
import { ChangeManagementHeaderBarComponent } from './pages/change-management/shared/header-bar/header-bar.component';
import { CreatePoModalComponent } from './pages/change-management/shared/create-po-modal/create-po-modal.component';
import { ServiceImpactModalComponent } from './pages/change-management/shared/service-impact-modal/service-impact-modal.component';
import { ContactCentreModalComponent } from './pages/change-management/shared/contact-centre-modal/contact-centre-modal.component';
import { IncidentManagementComponent } from './pages/incident-management/incident-management.component';
import { IncidentManagementHeaderBarComponent } from './pages/incident-management/components/header-bar/header-bar.component';
import { NsttStatusComponent } from './pages/incident-management/components/nstt-status/nstt-status.component';
import { AllNsttsComponent } from './pages/incident-management/components/all-nstts/all-nstts.component';
import { EscalationMatrixComponent } from './pages/escalation-matrix/escalation-matrix.component';
import { EscalationLevelsComponent } from './pages/escalation-matrix/components/escalation-levels/escalation-levels.component';
import { EscalatedSrsComponent } from './pages/escalation-matrix/components/escalated-srs/escalated-srs.component';
import { NocPortalComponent } from './pages/noc-portal/noc-portal.component';
import { NocHealthIndexComponent } from './pages/noc-portal/components/health-index/health-index.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SrOverviewComponent,
    IncidentManagementCardComponent,
    ChangeManagementCardComponent,
    EscalationMatrixCardComponent,
    ChangeManagementLandingComponent,
    ChangeManagementLandingTopBarComponent,
    ChangeManagementLandingStatCardsComponent,
    ChangeManagementLandingChangesPanelComponent,
    ChangeManagementCrqComponent,
    ChangeManagementSidebarNavComponent,
    ChangeManagementHeaderBarComponent,
    CrqPlannedOutagesComponent,
    PlannedOutageInputComponent,
    CreatePoModalComponent,
    ServiceImpactModalComponent,
    ContactCentreModalComponent,
    IncidentManagementComponent,
    IncidentManagementHeaderBarComponent,
    NsttStatusComponent,
    AllNsttsComponent,
    EscalationMatrixComponent,
    EscalationLevelsComponent,
    EscalatedSrsComponent,
    NocPortalComponent,
    NocHealthIndexComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }