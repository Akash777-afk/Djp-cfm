import { Component, HostListener, OnInit } from '@angular/core';
import { StatTile } from './components/nstt-status/nstt-status.component';
import { NsttRow } from './components/all-nstts/all-nstts.component';
import { INCIDENT_STATUS_COUNTS, INCIDENT_TOTAL_COUNT } from './incident-management.constants';

@Component({
  selector: 'app-incident-management',
  templateUrl: './incident-management.component.html',
  styleUrls: ['./incident-management.component.scss']
})
export class IncidentManagementComponent implements OnInit {

  // ---------- Responsive scale-to-fit (same approach as the landing canvas) ----------
  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  ngOnInit(): void {
    this.updateScale();
  }

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / IncidentManagementComponent.DESIGN_WIDTH, 1);
  }

  // ---------- Welcome banner ----------
  userName = 'Akash Ganapathy2';

  onCallClick(): void {
    console.log('Call clicked');
  }
  onBookClick(): void {
    console.log('Book clicked');
  }

  // ---------- NSTT status ----------
  onNsttStatusRefresh(): void {
    console.log('Refresh NSTT status');
  }

  // Which single stat tile is currently "active" (special style + table
  // filter). Defaults to 'all' since the table starts out showing every row.
  activeCardKey = 'all';

  private readonly keyToStatus: Record<string, string> = {
    'in-progress': 'In progress',
    assigned: 'Assigned',
    escalated: 'Escalated',
    resolved: 'Resolved',
    closed: 'Closed',
    cancelled: 'Cancelled',
    unknown: 'Unknown',
  };

  // null = no filter (show every row), matching the 'all' tile.
  get statusFilter(): string | null {
    return this.activeCardKey === 'all' ? null : this.keyToStatus[this.activeCardKey];
  }

  setActiveCard(key: string): void {
    this.activeCardKey = key;
  }

  // ---------- Stat Tiles (left to right order) ----------
  statTiles: StatTile[] = [
    {
      key: 'all',
      label: 'All Tasks',
      value: String(INCIDENT_TOTAL_COUNT),
      badge: '+24',
      badgeExtra: 'today',
      bg: 'rgba(174,174,174,0.15)',
      borderColor: '#9ca3af',
      textColor: '#6b7280',
      badgeBorderColor: '#000',
      valueLeft: 144,
      badgeWidth: 91,
      icon: '/assets/incident-management/im-2-cd1-t.svg',
      badgeIcon: '/assets/incident-management/im-2-cd1-b.svg'
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      value: String(INCIDENT_STATUS_COUNTS.inProgress),
      badge: '+12',
      badgeExtra: 'today',
      bg: 'rgba(59,130,246,0.12)',
      borderColor: '#3b82f6',
      textColor: '#3b82f6',
      badgeBorderColor: '#3b82f6',
      valueLeft: 144,
      badgeWidth: 90,
      icon: '/assets/incident-management/im-2-cd2-t.svg',
      badgeIcon: '/assets/incident-management/im-2-cd2-b.svg'
    },
    {
      key: 'assigned',
      label: 'Assigned',
      value: String(INCIDENT_STATUS_COUNTS.assigned),
      badge: 'Awaiting action',
      badgeExtra: '',
      bg: '#f5f3ff',
      borderColor: '#8b5cf6',
      textColor: '#8b5cf6',
      badgeBorderColor: '#8b5cf6',
      valueLeft: 162,
      badgeWidth: 145,
      icon: '/assets/incident-management/im-2-cd3-t.svg',
      badgeIcon: '/assets/incident-management/im-2-cd3-b.svg'
    },
    {
      key: 'escalated',
      label: 'Escalated',
      value: String(INCIDENT_STATUS_COUNTS.escalated),
      badge: '+3',
      badgeExtra: 'critical',
      bg: '#fef2f2',
      borderColor: '#e60023',
      textColor: '#e60023',
      badgeBorderColor: '#e60023',
      valueLeft: 162,
      badgeWidth: 90,
      icon: '/assets/incident-management/im-2-cd4-t.svg',
      badgeIcon: '/assets/incident-management/im-2-cd4-b.svg'
    },
    {
      key: 'resolved',
      label: 'Resolved',
      value: String(INCIDENT_STATUS_COUNTS.resolved),
      badge: '+48',
      badgeExtra: 'today',
      bg: '#f0fdf4',
      borderColor: '#10b981',
      textColor: '#208261',
      badgeBorderColor: '#10b981',
      valueLeft: 162,
      badgeWidth: 91,
      icon: '/assets/incident-management/im-2-cd5-t.svg',
      badgeIcon: '/assets/incident-management/im-2-cd5-b.svg'
    },
    {
      key: 'closed',
      label: 'Closed',
      value: String(INCIDENT_STATUS_COUNTS.closed),
      badge: '-5',
      badgeExtra: 'vs yesterday',
      bg: 'rgba(255,223,245,0.34)',
      borderColor: '#b70777',
      textColor: '#b70777',
      badgeBorderColor: '#b70777',
      valueLeft: 162,
      badgeWidth: 155,
      icon: '/assets/incident-management/im-2-cd6-t.svg',
      badgeIcon: '/assets/incident-management/im-2-cd6-b.svg'
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
      value: String(INCIDENT_STATUS_COUNTS.cancelled),
      badge: 'User requested',
      badgeExtra: '',
      bg: '#fff7ed',
      borderColor: '#f97316',
      textColor: '#ff7007',
      badgeBorderColor: '#f97316',
      valueLeft: 162,
      badgeWidth: 121,
      icon: '/assets/incident-management/im-2-cd7-t.svg',
      badgeIcon: '/assets/incident-management/im-2-cd7-b.svg'
    },
    {
      key: 'unknown',
      label: 'Unknown',
      value: String(INCIDENT_STATUS_COUNTS.unknown),
      badge: 'Needs review',
      badgeExtra: '',
      bg: '#fefce8',
      borderColor: '#eab308',
      textColor: '#b0880b',
      badgeBorderColor: 'rgba(234,179,8,0.74)',
      valueLeft: 162,
      badgeWidth: 135,
      icon: '/assets/incident-management/im-2-cd8-t.svg',
      badgeIcon: '/assets/incident-management/im-2-cd8-b.svg'
    },
  ];

  // ---------- NSTT Table Rows ----------
  // Counts per status mirror the stat tiles above exactly (28 + 9 + 3 + 1 = 41,
  // matching "All Tasks"); Escalated/Cancelled/Unknown have no rows since
  // their tiles are 0.
  nsttRows: NsttRow[] = this.buildMockRows();

  private buildMockRows(): NsttRow[] {
    // The 7 original mock rows — every field identical except VIP flag
    // (3 diamond, then 4 account), cycled to fill 41 rows. Status is the only
    // field that varies across the full set, per the counts above.
    const vipCycle: Array<'diamond' | 'account'> = ['diamond', 'diamond', 'diamond', 'account', 'account', 'account', 'account'];
    const statusCounts: { status: string; count: number }[] = [
      { status: 'In progress', count: INCIDENT_STATUS_COUNTS.inProgress },
      { status: 'Assigned', count: INCIDENT_STATUS_COUNTS.assigned },
      { status: 'Resolved', count: INCIDENT_STATUS_COUNTS.resolved },
      { status: 'Closed', count: INCIDENT_STATUS_COUNTS.closed },
    ];

    const rows: NsttRow[] = [];
    let i = 0;
    for (const { status, count } of statusCounts) {
      for (let j = 0; j < count; j++, i++) {
        rows.push({
          vipType: vipCycle[i % vipCycle.length],
          nstt: 'INC0012345',
          nsttAgeing: '03.20.26',
          site: 'LUCKNOW',
          status,
          actualIncidentTime: '12.08.25   03:10:12',
          assignedGroup: 'Noc_NS',
          lastErtTime: '12.08.25   03:10:12',
          upTime: '12.08.25   03:10:12',
        });
      }
    }
    return rows;
  }
}
