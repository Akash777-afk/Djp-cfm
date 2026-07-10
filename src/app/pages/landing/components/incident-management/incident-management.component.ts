import { Component, Input } from '@angular/core';
import { IncidentBar, IncidentStat, SectionVariant } from '../../landing.types';

@Component({
  selector: 'app-landing-incident-management',
  templateUrl: './incident-management.component.html',
  styleUrls: ['./incident-management.component.scss']
})
export class IncidentManagementCardComponent {

  @Input() variant: SectionVariant = 'desktop';

  // Position within the reorderable 2x2 grid, supplied by LandingComponent.
  @Input() top = 0;
  @Input() left = 0;
  @Input() order = 0;

  incidentCardTitle    = 'Incident management';
  incidentCardSubtitle = 'Real-Time Incident Management for all Networks.';

  incidentStats: IncidentStat[] = [
    { value: '06',    label: 'Unknown',     bg: '#f2f7ff', border: '#e6e6e6', color: '#94a3b8', width: 92 },
    { value: '342',   label: 'In Progress', bg: '#eff6ff', border: '#d9e8fc', color: '#2563eb', width: 94 },
    { value: '156',   label: 'Assigned',    bg: '#f5f3ff', border: '#e2dcff', color: '#8b5cf6', width: 93 },
    { value: '18',    label: 'Escalated',   bg: '#fef2f2', border: '#ffe1e1', color: '#e60012', width: 92 },
    { value: '524',   label: 'Resolved',    bg: '#f0fdf4', border: '#c3ffd9', color: '#16a34a', width: 92 },
    { value: '189',   label: 'Closed',      bg: '#f8fafc', border: '#e2eaf5', color: '#475569', width: 93 },
    { value: '12',    label: 'Cancelled',   bg: '#fffbeb', border: '#ffebd3', color: '#d97706', width: 94 },
    { value: '1,247', label: 'Total',       bg: '#f8fafc', border: '#e4ecf4', color: '#0f172a', width: 92 },
  ];

  incidentBars: IncidentBar[] = [
    { height: 26,  active: false },
    { height: 107, active: false },
    { height: 65,  active: false },
    { height: 18,  active: false },
    { height: 145, active: false },
    { height: 65,  active: false },
    { height: 18,  active: false },
    { height: 182, active: true  },
  ];

  incidentYLabels: string[] = ['1000', '500', '250', '100', '0'];
  incidentXLabels: string[] = ['Unknown', 'In progress', 'Assigned', 'Escalated', 'Resolved', 'Closed', 'Cancelled', 'Total'];

  // Used by the mobile bar chart to scale bars relative to the tallest bar,
  // since that chart has no fixed pixel canvas to size against.
  get incidentBarMax(): number {
    return Math.max(...this.incidentBars.map(b => b.height));
  }

  onExpandCard(): void {
    console.log('Expand card: incident');
    // TODO: open a full-screen modal / dedicated route for this card
  }
}
