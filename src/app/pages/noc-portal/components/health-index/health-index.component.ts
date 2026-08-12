import { Component } from '@angular/core';
import { ASSET } from '../../noc-portal.constants';

export interface HealthChartLegendItem {
  label: string;
  color: string;
}

export interface HealthChart {
  key: string;
  title: string;
  legend: HealthChartLegendItem[];
  yAxisLabels: string[]; // top → bottom
  xAxisLabels: string[]; // left → right
  graphImage: string;
  graphAlt: string;
  // Each source SVG's own viewBox aspect ratio doesn't match the (fixed)
  // plot box's ~2.45:1 aspect equally well: 'contain' (the default look)
  // shrinks-to-fit and can letterbox a graph that's relatively "taller"
  // than the plot box, leaving it visibly narrower than the gridlines —
  // that's what happened to the latency graph (1.74:1, much more square
  // than the plot box). 'cover' fills the box completely by cropping the
  // excess instead, which is safe there because that SVG has huge built-in
  // vertical margin (its curve only occupies the middle ~52% of its own
  // viewBox height) for the crop to eat into. The other two graphs are
  // already wider than the plot box under 'contain' (no letterboxing) and
  // have almost no horizontal margin, so 'cover' would crop straight into
  // their curves — they stay 'contain'.
  imgFit: 'contain' | 'cover';
  // Only meaningful when imgFit is 'cover' (it controls which part of the
  // oversized image survives the crop). The latency SVG's built-in margin
  // isn't split evenly above/below its curve — there's more blank space
  // below the 0-line than above the peak — so a centered crop still left a
  // visible gap between the wave's baseline and the 0ms gridline. Anchoring
  // the crop to 'top' instead eats into the (larger) bottom margin first,
  // pulling the baseline down flush with the gridline. Defaults to center.
  imgPosition?: string;
}

// The 3 chart CURVES are the real designer-provided SVG waves (LSI Wave
// Graph asset) rendered as-is via <img>, layered over hand-built axis
// labels / gridlines / legend chrome — not a computed/data-bound chart, per
// the brief: "Preserve its appearance". Swap for a live chart library bound
// to real data once the backend exists. Legend dot colors are read directly
// from each SVG's own fill/stroke values (not guessed), so they always
// match their curve.
@Component({
  selector: 'app-noc-health-index',
  templateUrl: './health-index.component.html',
  styleUrls: ['./health-index.component.scss']
})
export class NocHealthIndexComponent {
  // Real designer-provided badge asset (red-gradient box + chart glyph
  // baked into one SVG) — supersedes the earlier graph.svg-in-a-CSS-box
  // stand-in now that this exists.
  readonly headingIcon = `${ASSET}/LSIHI.svg`;
  readonly refreshIcon = `${ASSET}/Frame 13.svg`;
  readonly dropdownIcon = `${ASSET}/Frame 14.svg`;

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
      graphImage: `${ASSET}/Group 427319876.svg`,
      graphAlt: 'Latency and packet loss graph',
      imgFit: 'cover',
      imgPosition: 'top',
    },
    {
      key: 'bandwidth',
      title: 'Bandwidth Throughput',
      legend: [{ label: 'Bandwidth Throughput', color: '#E6B415' }],
      yAxisLabels: ['1250ms', '1000ms', '750ms', '500ms', '250ms', '0ms'],
      xAxisLabels: ['13:20', '13:35', '14:05', '14:20', '14:35', '14:50', '15:05', '15:10'],
      graphImage: `${ASSET}/Group 427319873.svg`,
      graphAlt: 'Bandwidth throughput graph',
      imgFit: 'contain',
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
      graphImage: `${ASSET}/traffic.svg`,
      graphAlt: 'Traffic utilization graph',
      imgFit: 'contain',
    },
  ];

  onRefresh(): void {
    console.log('LSI Health Index refresh clicked');
  }
  onDropdownClick(): void {
    console.log('LSI Health Index dropdown clicked');
  }
}
