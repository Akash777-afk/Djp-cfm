import { Component, OnInit } from '@angular/core';
import { ASSET } from '../../noc-portal.constants';
import { HealthIndexService } from '../../services/health-index.service';
import { ChartSeries, ChartThreshold, CurveStyle } from '../svg-line-chart/svg-line-chart.component';

export interface HealthChartLegendItem {
  label: string;
  color: string;
}

export interface HealthChart {
  key: string;
  title: string;
  legend: HealthChartLegendItem[];
  yAxisLabels: string[]; // top → bottom, display only
  xAxisLabels: string[]; // left → right, display + tooltip labels
  // Numeric range backing yAxisLabels above — kept in sync with it by hand
  // (yAxisLabels is presentation text, e.g. "1250ms"; yMin/yMax are what
  // app-svg-line-chart actually plots against) since the two must always
  // describe the same scale.
  yMin: number;
  yMax: number;
  variant: 'line' | 'area';
  curve: CurveStyle;
  thresholds?: ChartThreshold[];
  // Populated from HealthIndexService — starts empty so the chart's own
  // per-series empty-state renders correctly during the brief window before
  // the first response lands, rather than a chart with stale/wrong shape.
  series: ChartSeries[];
}

// The 3 chart CURVES are now a real data-driven SVG visualization
// (app-svg-line-chart) bound to HealthIndexService — not the earlier static
// designer wave images. Axis labels / gridlines / legend chrome around them
// stay hand-built exactly as before (see health-index.component.html) —
// only the innermost .nhi-chart-img was replaced. Legend dot colors here
// must keep matching each series' own color 1:1 (both are still hand-kept
// in sync, same as before — there was never a single shared source for
// this, just discipline about not editing one without the other).
@Component({
  selector: 'app-noc-health-index',
  templateUrl: './health-index.component.html',
  styleUrls: ['./health-index.component.scss']
})
export class NocHealthIndexComponent implements OnInit {
  constructor(private healthIndexService: HealthIndexService) {}

  // Real designer-provided badge asset (red-gradient box + chart glyph
  // baked into one SVG) — supersedes the earlier graph.svg-in-a-CSS-box
  // stand-in now that this exists.
  readonly headingIcon = `${ASSET}/LSIHI.svg`;
  readonly refreshIcon = `${ASSET}/Frame 13.svg`;
  readonly dropdownIcon = `${ASSET}/Frame 14.svg`;

  // Drives app-card-loading-overlay — true for exactly as long as
  // getHealthIndexData()'s call is in flight, same reactive-to-the-real-
  // Observable pattern used by every other card in this app (no fixed
  // timeout). See IncidentManagementCardComponent.isLoading for the fuller
  // rationale — it applies identically here.
  isLoading = true;

  charts: HealthChart[] = [
    {
      key: 'latency',
      title: 'Latency & packet loss',
      legend: [
        { label: 'WAN 1', color: '#B70777' },
        { label: 'WAN 2', color: '#0A1DA6' },
      ],
      yAxisLabels: ['1250ms', '1000ms', '750ms', '500ms', '250ms', '0ms'],
      xAxisLabels: ['13:20', '13:35', '14:05', '14:20', '14:35', '14:50', '15:05', '15:10'],
      yMin: 0,
      yMax: 1250,
      variant: 'area',
      // Sharp straight-segment lines here (not the smooth curve default) —
      // per explicit request, latency/packet-loss reads as raw sampled
      // readings rather than an interpolated trend.
      curve: 'sharp',
      series: [],
    },
    {
      key: 'bandwidth',
      title: 'Bandwidth Throughput',
      legend: [{ label: 'Bandwidth Throughput', color: '#E6B415' }],
      yAxisLabels: ['1250ms', '1000ms', '750ms', '500ms', '250ms', '0ms'],
      xAxisLabels: ['13:20', '13:35', '14:05', '14:20', '14:35', '14:50', '15:05', '15:10'],
      yMin: 0,
      yMax: 1250,
      variant: 'area',
      curve: 'smooth',
      series: [],
    },
    {
      key: 'traffic',
      title: 'Traffic Utilization',
      legend: [
        { label: 'In traffic', color: '#3B82F6' },
        { label: 'Out traffic', color: '#22C55E' },
      ],
      yAxisLabels: ['120kbps', '100kbps', '75kbps', '50kbps', '25kbps', '0kbps'],
      xAxisLabels: ['11 Mar 12:00 pm', '11 Mar 12:10 pm', '11 Mar 12:20 pm', '11 Mar 12:30 pm'],
      yMin: 0,
      yMax: 120,
      variant: 'area',
      curve: 'smooth',
      series: [],
    },
  ];

  ngOnInit(): void {
    this.fetchHealthIndex();
  }

  onRefresh(): void {
    this.fetchHealthIndex();
  }

  private fetchHealthIndex(): void {
    this.isLoading = true;
    this.healthIndexService.getHealthIndexData().subscribe(data => {
      this.isLoading = false;
      const byKey: Record<string, { series: ChartSeries[]; thresholds?: ChartThreshold[] }> = {
        latency: data.latency,
        bandwidth: data.bandwidth,
        traffic: data.traffic,
      };
      this.charts = this.charts.map(chart => ({
        ...chart,
        series: byKey[chart.key]?.series ?? [],
        thresholds: byKey[chart.key]?.thresholds ?? chart.thresholds,
      }));
    });
  }

  onDropdownClick(): void {
    console.log('LSI Health Index dropdown clicked');
  }
}
