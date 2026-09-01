import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/Landing/landing.component';
import { SrOverviewComponent } from './pages/Landing/components/sr-overview/sr-overview.component';
import { IncidentManagementCardComponent } from './pages/Landing/components/incident-management/incident-management.component';
import { ChangeManagementCardComponent } from './pages/Landing/components/change-management/change-management.component';
import { EscalationMatrixCardComponent } from './pages/Landing/components/escalation-matrix/escalation-matrix.component';
import { ChangeManagementLandingComponent } from './pages/CM/landing/change-management-landing.component';
import { ChangeManagementLandingTopBarComponent } from './pages/CM/landing/components/top-bar/top-bar.component';
import { ChangeManagementLandingStatCardsComponent } from './pages/CM/landing/components/stat-cards/stat-cards.component';
import { ChangeManagementLandingChangesPanelComponent } from './pages/CM/landing/components/changes-panel/changes-panel.component';
import { ChangeManagementCrqComponent } from './pages/CM/crq/change-management-crq.component';
import { CrqPlannedOutagesComponent } from './pages/CM/crq/components/crq-planned-outages/crq-planned-outages.component';
import { PlannedOutageInputComponent } from './pages/CM/crq/components/planned-outage-input/planned-outage-input.component';
import { ChangeManagementSidebarNavComponent } from './pages/CM/components/sidebar-nav/sidebar-nav.component';
import { CreatePoModalComponent } from './pages/CM/components/create-po-modal/create-po-modal.component';
import { ServiceImpactModalComponent } from './pages/CM/components/service-impact-modal/service-impact-modal.component';
import { ContactCentreModalComponent } from './pages/CM/components/contact-centre-modal/contact-centre-modal.component';
import { ImpactedLsiModalComponent } from './pages/CM/components/impacted-lsi-modal/impacted-lsi-modal.component';
import { IncidentManagementComponent } from './pages/IM/incident-management.component';
import { NsttStatusComponent } from './pages/IM/components/nstt-status/nstt-status.component';
import { AllNsttsComponent } from './pages/IM/components/all-nstts/all-nstts.component';
import { NsttSrDrawerComponent } from './pages/IM/components/nstt-sr-drawer/nstt-sr-drawer.component';
import { ColumnSettingsModalComponent } from './pages/IM/components/column-settings-modal/column-settings-modal.component';
import { EscalationMatrixComponent } from './pages/EM/escalation-matrix.component';
import { EscalationLevelsComponent } from './pages/EM/components/escalation-levels/escalation-levels.component';
import { EscalatedSrsComponent } from './pages/EM/components/escalated-srs/escalated-srs.component';
import { NocPortalComponent } from './pages/NOC/noc-portal.component';
import { NocHealthIndexComponent } from './pages/NOC/components/health-index/health-index.component';
import { NocAllSrsComponent } from './pages/NOC/components/all-srs/all-srs.component';
import { TopologyModalComponent } from './pages/NOC/components/modals/topology-modal/topology-modal.component';
import { LinkStatusModalComponent } from './pages/NOC/components/modals/link-status-modal/link-status-modal.component';
import { InventoryBlueprintModalComponent } from './pages/NOC/components/modals/inventory-blueprint-modal/inventory-blueprint-modal.component';
import { BundleSummaryModalComponent } from './pages/NOC/components/modals/bundle-summary-modal/bundle-summary-modal.component';
import { PerformanceKpiModalComponent } from './pages/NOC/components/modals/performance-kpi-modal/performance-kpi-modal.component';
import { AccordionSectionComponent } from './pages/NOC/components/accordion-section/accordion-section.component';
import { WorkNotesComponent } from './pages/NOC/components/work-notes/work-notes.component';
import { SrSummaryComponent } from './pages/NOC/components/sr-summary/sr-summary.component';
import { NocChatbotComponent } from './pages/NOC/components/chatbot/noc-chatbot.component';
import { LoadingOverlayComponent } from './shared/loading-overlay/loading-overlay.component';
import { CardLoadingOverlayComponent } from './shared/card-loading-overlay/card-loading-overlay.component';
import { SvgLineChartComponent } from './pages/NOC/components/svg-line-chart/svg-line-chart.component';

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
    CrqPlannedOutagesComponent,
    PlannedOutageInputComponent,
    CreatePoModalComponent,
    ServiceImpactModalComponent,
    ContactCentreModalComponent,
    ImpactedLsiModalComponent,
    IncidentManagementComponent,
    NsttStatusComponent,
    AllNsttsComponent,
    NsttSrDrawerComponent,
    ColumnSettingsModalComponent,
    EscalationMatrixComponent,
    EscalationLevelsComponent,
    EscalatedSrsComponent,
    NocPortalComponent,
    NocHealthIndexComponent,
    NocAllSrsComponent,
    TopologyModalComponent,
    LinkStatusModalComponent,
    InventoryBlueprintModalComponent,
    BundleSummaryModalComponent,
    PerformanceKpiModalComponent,
    AccordionSectionComponent,
    WorkNotesComponent,
    SrSummaryComponent,
    LoadingOverlayComponent,
    CardLoadingOverlayComponent,
    SvgLineChartComponent,
    NocChatbotComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }