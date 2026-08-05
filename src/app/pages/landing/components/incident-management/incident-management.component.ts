import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IncidentBar, IncidentStat, SectionVariant } from '../../landing.types';
import { INCIDENT_STATUS_COUNTS, INCIDENT_TOTAL_COUNT } from '../../../incident-management/incident-management.constants';

@Component({
  selector: 'app-landing-incident-management',
  templateUrl: './incident-management.component.html',
  styleUrls: ['./incident-management.component.scss']
})
export class IncidentManagementCardComponent {

  constructor(private router: Router) {}

  @Input() variant: SectionVariant = 'desktop';

  // Position within the reorderable 2x2 grid, supplied by LandingComponent.
  @Input() top = 0;
  @Input() left = 0;
  @Input() order = 0;

  incidentCardTitle    = 'Incident management';
  incidentCardSubtitle = 'Real-Time Incident Management for all Networks.';

  // Counts come from the Incident Management page's own constants, so this
  // card can never disagree with the real page on the numbers; bg/border/
  // color/width stay local since they're purely this card's styling.
  incidentStats: IncidentStat[] = [
    { value: String(INCIDENT_STATUS_COUNTS.unknown),    label: 'Unknown',     bg: '#f2f7ff', border: '#e6e6e6', color: '#94a3b8', width: 92 },
    { value: String(INCIDENT_STATUS_COUNTS.inProgress), label: 'In Progress', bg: '#eff6ff', border: '#d9e8fc', color: '#2563eb', width: 94 },
    { value: String(INCIDENT_STATUS_COUNTS.assigned),   label: 'Assigned',    bg: '#f5f3ff', border: '#e2dcff', color: '#8b5cf6', width: 93 },
    { value: String(INCIDENT_STATUS_COUNTS.escalated),  label: 'Escalated',   bg: '#fef2f2', border: '#ffe1e1', color: '#e60012', width: 92 },
    { value: String(INCIDENT_STATUS_COUNTS.resolved),   label: 'Resolved',    bg: '#f0fdf4', border: '#c3ffd9', color: '#16a34a', width: 92 },
    { value: String(INCIDENT_STATUS_COUNTS.closed),     label: 'Closed',      bg: '#f8fafc', border: '#e2eaf5', color: '#475569', width: 93 },
    { value: String(INCIDENT_STATUS_COUNTS.cancelled),  label: 'Cancelled',   bg: '#fffbeb', border: '#ffebd3', color: '#d97706', width: 94 },
    { value: String(INCIDENT_TOTAL_COUNT),               label: 'Total',       bg: '#f8fafc', border: '#e4ecf4', color: '#0f172a', width: 92 },
  ];

  // Axis top value + pixel ceiling the bars scale against, chosen to fit the
  // current mock data's range (Total = 41) while keeping the chart's visual
  // proportions close to the original design's max bar height.
  private readonly BAR_AXIS_MAX = 40;
  private readonly BAR_MAX_HEIGHT_PX = 182;

  private barHeight(count: number): number {
    return Math.round((count / this.BAR_AXIS_MAX) * this.BAR_MAX_HEIGHT_PX);
  }

  incidentBars: IncidentBar[] = [
    { height: this.barHeight(INCIDENT_STATUS_COUNTS.unknown),    active: false },
    { height: this.barHeight(INCIDENT_STATUS_COUNTS.inProgress), active: false },
    { height: this.barHeight(INCIDENT_STATUS_COUNTS.assigned),   active: false },
    { height: this.barHeight(INCIDENT_STATUS_COUNTS.escalated),  active: false },
    { height: this.barHeight(INCIDENT_STATUS_COUNTS.resolved),   active: false },
    { height: this.barHeight(INCIDENT_STATUS_COUNTS.closed),     active: false },
    { height: this.barHeight(INCIDENT_STATUS_COUNTS.cancelled),  active: false },
    { height: this.barHeight(INCIDENT_TOTAL_COUNT),              active: true  },
  ];

  incidentYLabels: string[] = ['40', '30', '20', '10', '0'];
  incidentXLabels: string[] = ['Unknown', 'In progress', 'Assigned', 'Escalated', 'Resolved', 'Closed', 'Cancelled', 'Total'];

  // Used by the mobile bar chart to scale bars relative to the tallest bar,
  // since that chart has no fixed pixel canvas to size against.
  get incidentBarMax(): number {
    return Math.max(...this.incidentBars.map(b => b.height));
  }

  onExpandCard(): void {
    this.router.navigate(['/incident-management']);
  }
}
