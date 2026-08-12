import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface KpiField {
  label: string;
  value: string;
}

export interface KpiTab {
  key: string;
  label: string;
  // Only 'rf-kpi-ap' has reference data — the other 4 tabs switch but show
  // an empty state, since nothing was specified for their fields.
  leftFields: KpiField[];
  rightFields: KpiField[];
}

@Component({
  selector: 'app-noc-performance-kpi-modal',
  templateUrl: './performance-kpi-modal.component.html',
  styleUrls: ['./performance-kpi-modal.component.scss']
})
export class PerformanceKpiModalComponent {

  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  readonly tabs: KpiTab[] = [
    {
      key: 'rf-kpi-ap', label: 'RF KPI AP',
      leftFields: [
        { label: 'EIRN', value: 'NA' },
        { label: 'TRAP IP', value: 'NA' },
        { label: 'UAS', value: 'NA' },
        { label: 'Management VLAN', value: '553' },
        { label: 'Duplex', value: 'NA' },
        { label: 'SW version', value: 'CPE MAX v7.63.71019.Muskat.19' },
        { label: 'SSID', value: 'airtel_Muscat_dl1539_p2mp' },
        { label: 'Distance', value: 'NA' },
      ],
      rightFields: [
        { label: 'Speed', value: '100Mbps' },
        { label: 'QAM (DL MCS)', value: 'NA' },
        { label: 'Channel bandwidth', value: '20' },
        { label: 'Hardware Version', value: 'CPE MAX' },
        { label: 'RSSI', value: '55' },
        { label: 'CRC', value: '27' },
        { label: 'Device name', value: 'DL 22613 SURAJPUR GR NOIDA' },
        { label: 'System Uptime', value: '227hrs 49mins 13sec' },
      ],
    },
    { key: 'microwave-kpi',    label: 'Microwave KPI',    leftFields: [], rightFields: [] },
    { key: 'affected-section', label: 'Affected Section', leftFields: [], rightFields: [] },
    { key: 'ftth-kpi',         label: 'FTTH KPI',         leftFields: [], rightFields: [] },
    { key: 'ptn-kpi',          label: 'PTN KPI',          leftFields: [], rightFields: [] },
  ];

  activeTabKey = this.tabs[0].key;

  get activeTab(): KpiTab {
    return this.tabs.find(t => t.key === this.activeTabKey) || this.tabs[0];
  }

  setTab(tab: KpiTab): void {
    this.activeTabKey = tab.key;
  }

  close(): void {
    this.closed.emit();
  }

  reset(): void {
    console.log('Performance KPI: reset');
  }

  submit(): void {
    console.log('Performance KPI: submit');
  }
}
