import { Component } from '@angular/core';

interface StatTile {
  label: string;
  value: string;
  badge: string;
  badgeExtra: string;
  bg: string;
  borderColor: string;
  textColor: string;
  badgeBorderColor: string;
  valueLeft: number;
  badgeWidth: number;
}

interface NsttRow {
  vipType: 'diamond' | 'account';
  nstt: string;
  nsttAgeing: string;
  site: string;
  status: string;
  actualIncidentTime: string;
  assignedGroup: string;
  lastErtTime: string;
  upTime: string;
}

interface PaginationPage {
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-incident-management',
  templateUrl: './incident-management.component.html',
  styleUrls: ['./incident-management.component.scss']
})
export class IncidentManagementComponent {

  // ---------- Topbar ----------
  lastUpdated = '09.56 am 28.04.2024';
  pageTitle = 'Incident management';
  searchPlaceholder = 'Select bin...';

  // ---------- Stat Tiles (left to right order) ----------
  statTiles: StatTile[] = [
    {
      label: 'All Tasks',
      value: '1,247',
      badge: '+24',
      badgeExtra: 'today',
      bg: 'rgba(174,174,174,0.15)',
      borderColor: '#9ca3af',
      textColor: '#6b7280',
      badgeBorderColor: '#000',
      valueLeft: 92,
      badgeWidth: 91
    },
    {
      label: 'In Progress',
      value: '342',
      badge: '+12',
      badgeExtra: 'today',
      bg: 'rgba(59,130,246,0.12)',
      borderColor: '#3b82f6',
      textColor: '#3b82f6',
      badgeBorderColor: '#3b82f6',
      valueLeft: 112,
      badgeWidth: 90
    },
    {
      label: 'Assigned',
      value: '156',
      badge: 'Awaiting action',
      badgeExtra: '',
      bg: '#f5f3ff',
      borderColor: '#8b5cf6',
      textColor: '#8b5cf6',
      badgeBorderColor: '#8b5cf6',
      valueLeft: 118,
      badgeWidth: 118
    },
    {
      label: 'Escalated',
      value: '18',
      badge: '+3',
      badgeExtra: 'critical',
      bg: '#fef2f2',
      borderColor: '#e60023',
      textColor: '#e60023',
      badgeBorderColor: '#e60023',
      valueLeft: 137,
      badgeWidth: 90
    },
    {
      label: 'Resolved',
      value: '524',
      badge: '+48',
      badgeExtra: 'today',
      bg: '#f0fdf4',
      borderColor: '#10b981',
      textColor: '#208261',
      badgeBorderColor: '#10b981',
      valueLeft: 113,
      badgeWidth: 91
    },
    {
      label: 'Closed',
      value: '189',
      badge: '-5',
      badgeExtra: 'vs yesterday',
      bg: 'rgba(255,223,245,0.34)',
      borderColor: '#b70777',
      textColor: '#b70777',
      badgeBorderColor: '#b70777',
      valueLeft: 117,
      badgeWidth: 118
    },
    {
      label: 'Cancelled',
      value: '12',
      badge: 'User requested',
      badgeExtra: '',
      bg: '#fff7ed',
      borderColor: '#f97316',
      textColor: '#ff7007',
      badgeBorderColor: '#f97316',
      valueLeft: 138,
      badgeWidth: 121
    },
    {
      label: 'Unknown',
      value: '06',
      badge: 'Needs review',
      badgeExtra: '',
      bg: '#fefce8',
      borderColor: '#eab308',
      textColor: '#b0880b',
      badgeBorderColor: 'rgba(234,179,8,0.74)',
      valueLeft: 133,
      badgeWidth: 110
    },
  ];

  // ---------- NSTT Table Rows ----------
  nsttRows: NsttRow[] = [
    { vipType: 'diamond', nstt: 'INC0012345', nsttAgeing: '03.20.26', site: 'LUCKNOW', status: 'In progress', actualIncidentTime: '12.08.25   03:10:12', assignedGroup: 'Noc_NS', lastErtTime: '12.08.25   03:10:12', upTime: '12.08.25   03:10:12' },
    { vipType: 'diamond', nstt: 'INC0012345', nsttAgeing: '03.20.26', site: 'LUCKNOW', status: 'In progress', actualIncidentTime: '12.08.25   03:10:12', assignedGroup: 'Noc_NS', lastErtTime: '12.08.25   03:10:12', upTime: '12.08.25   03:10:12' },
    { vipType: 'diamond', nstt: 'INC0012345', nsttAgeing: '03.20.26', site: 'LUCKNOW', status: 'In progress', actualIncidentTime: '12.08.25   03:10:12', assignedGroup: 'Noc_NS', lastErtTime: '12.08.25   03:10:12', upTime: '12.08.25   03:10:12' },
    { vipType: 'account', nstt: 'INC0012345', nsttAgeing: '03.20.26', site: 'LUCKNOW', status: 'In progress', actualIncidentTime: '12.08.25   03:10:12', assignedGroup: 'Noc_NS', lastErtTime: '12.08.25   03:10:12', upTime: '12.08.25   03:10:12' },
    { vipType: 'account', nstt: 'INC0012345', nsttAgeing: '03.20.26', site: 'LUCKNOW', status: 'In progress', actualIncidentTime: '12.08.25   03:10:12', assignedGroup: 'Noc_NS', lastErtTime: '12.08.25   03:10:12', upTime: '12.08.25   03:10:12' },
    { vipType: 'account', nstt: 'INC0012345', nsttAgeing: '03.20.26', site: 'LUCKNOW', status: 'In progress', actualIncidentTime: '12.08.25   03:10:12', assignedGroup: 'Noc_NS', lastErtTime: '12.08.25   03:10:12', upTime: '12.08.25   03:10:12' },
    { vipType: 'account', nstt: 'INC0012345', nsttAgeing: '03.20.26', site: 'LUCKNOW', status: 'In progress', actualIncidentTime: '12.08.25   03:10:12', assignedGroup: 'Noc_NS', lastErtTime: '12.08.25   03:10:12', upTime: '12.08.25   03:10:12' },
  ];

  // ---------- Pagination ----------
  showingText = 'Showing 1–6 of 10 entries';
  pages: PaginationPage[] = [
    { label: 'Previous', active: false },
    { label: '1',        active: true  },
    { label: '2',        active: false },
    { label: '3',        active: false },
    { label: 'Next',     active: false },
  ];

  setPage(page: PaginationPage): void {
    if (page.label === 'Previous' || page.label === 'Next') return;
    this.pages.forEach(p => (p.active = false));
    page.active = true;
  }

  // Row spacing constant (px between rows in the column-major table)
  readonly ROW_GAP = 71;
}