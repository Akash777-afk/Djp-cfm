import { Component, HostListener, OnInit } from '@angular/core';
import { StatTile } from './components/nstt-status/nstt-status.component';
import { NsttRow } from './components/all-nstts/all-nstts.component';

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

  // ---------- Topbar ----------
  lastUpdated = '09.56 am 28.04.2024';
  pageTitle = 'Incident management';
  searchPlaceholder = 'Search for services...';
  searchQuery = '';

  onSearch(): void {
    console.log('Searching for:', this.searchQuery);
  }

  onMenuClick(): void {
    console.log('Menu clicked');
  }

  onTopbarRefresh(): void {
    console.log('Refresh clicked');
  }

  // ---------- NSTT status ----------
  onNsttStatusRefresh(): void {
    console.log('Refresh NSTT status');
  }

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
      badgeWidth: 91,
      icon: '/assets/im-2-cd1-t.svg',
      badgeIcon: '/assets/im-2-cd1-b.svg'
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
      badgeWidth: 90,
      icon: '/assets/im-2-cd2-t.svg',
      badgeIcon: '/assets/im-2-cd2-b.svg'
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
      badgeWidth: 145,
      icon: '/assets/im-2-cd3-t.svg',
      badgeIcon: '/assets/im-2-cd3-b.svg'
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
      badgeWidth: 90,
      icon: '/assets/im-2-cd4-t.svg',
      badgeIcon: '/assets/im-2-cd4-b.svg'
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
      badgeWidth: 91,
      icon: '/assets/im-2-cd5-t.svg',
      badgeIcon: '/assets/im-2-cd5-b.svg'
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
      badgeWidth: 155,
      icon: '/assets/im-2-cd6-t.svg',
      badgeIcon: '/assets/im-2-cd6-b.svg'
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
      badgeWidth: 121,
      icon: '/assets/im-2-cd7-t.svg',
      badgeIcon: '/assets/im-2-cd7-b.svg'
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
      badgeWidth: 135,
      icon: '/assets/im-2-cd8-t.svg',
      badgeIcon: '/assets/im-2-cd8-b.svg'
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
}
