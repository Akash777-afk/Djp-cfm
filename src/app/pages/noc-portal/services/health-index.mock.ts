import { ChartSeries, ChartThreshold } from '../../../shared/svg-line-chart/svg-line-chart.component';

// Representative sample data — no real LSI Health Index API exists anywhere
// in this codebase yet (unlike Incident Management / Escalation Matrix /
// Change Management / SR Summary, which all call a real endpoint with a
// mock fallback). These values are hand-picked to look like plausible real
// network telemetry (not random noise) so the chart reads correctly today;
// swap HealthIndexService.getHealthIndexData() for a real HTTP call once an
// endpoint exists — nothing else needs to change, callers already consume
// this through an Observable.
export interface HealthIndexChartData {
  key: string;
  series: ChartSeries[];
  thresholds?: ChartThreshold[];
}

export interface HealthIndexData {
  latency: HealthIndexChartData;
  bandwidth: HealthIndexChartData;
  traffic: HealthIndexChartData;
}

export function getMockHealthIndexData(): HealthIndexData {
  return {
    // 8 points, one per HealthChart.latency.xAxisLabels entry (13:20 .. 15:10).
    latency: {
      key: 'latency',
      series: [
        { key: 'wan1', label: 'WAN 1', color: '#B70777', values: [820, 650, 580, 980, 750, 620, 720, 480] },
        { key: 'wan2', label: 'WAN 2', color: '#0A1DA6', values: [20, 15, 380, 30, 10, 340, 15, 10] },
      ],
    },
    bandwidth: {
      key: 'bandwidth',
      series: [
        { key: 'throughput', label: 'Bandwidth Throughput', color: '#E6B415', values: [1050, 950, 1100, 850, 900, 750, 800, 620] },
      ],
    },
    // 4 points, one per HealthChart.traffic.xAxisLabels entry (12:00 .. 12:30).
    traffic: {
      key: 'traffic',
      series: [
        { key: 'in', label: 'In traffic', color: '#3B82F6', values: [25, 30, 95, 60] },
        { key: 'out', label: 'Out traffic', color: '#22C55E', values: [5, 8, 12, 10] },
      ],
      thresholds: [
        { value: 120, color: '#ef4444' },
        { value: 75, color: '#22c55e' },
      ],
    },
  };
}
