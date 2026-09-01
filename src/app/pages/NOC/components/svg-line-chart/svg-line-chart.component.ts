import { Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

export interface ChartSeries {
  key: string;
  label: string;
  color: string;
  // One value per x-axis position — same length as whatever xLabels the
  // host chart is using (see HealthChart.xAxisLabels). null/undefined at an
  // index means "no reading at that point" (drawn as a gap, not a false 0).
  values: Array<number | null | undefined>;
}

export interface ChartThreshold {
  value: number;
  color: string;
  label?: string;
}

export type CurveStyle = 'smooth' | 'sharp';

interface PlottedPoint { x: number; y: number; value: number | null | undefined; }
interface PlottedSeries { key: string; label: string; color: string; gradientId: string; lineD: string; areaD: string; points: PlottedPoint[]; }
interface PlottedThreshold { y: number; color: string; label?: string; value: number; }

// Reusable NOC-style line/area chart: given a numeric range + one or more
// value series, draws either smooth curves (Catmull-Rom → cubic bezier) or
// sharp straight-segment lines (per-chart via [curve]) — no external chart
// library — with optional gradient fill, optional threshold lines, hover
// tooltip, and a hover-to-highlight interaction. Deliberately
// generic — the only thing a consumer chart (like HealthChart) owns is its
// own axis labels/legend/gridlines/card chrome (see
// health-index.component.html), so this same component can plot any future
// LSI metric without any changes here.
@Component({
  selector: 'app-svg-line-chart',
  templateUrl: './svg-line-chart.component.html',
  styleUrls: ['./svg-line-chart.component.scss'],
})
export class SvgLineChartComponent implements OnChanges {
  private static nextUid = 0;
  readonly uid = SvgLineChartComponent.nextUid++;

  @Input() series: ChartSeries[] = [];
  @Input() yMin = 0;
  @Input() yMax = 100;
  @Input() thresholds: ChartThreshold[] = [];
  @Input() variant: 'line' | 'area' = 'area';
  // 'smooth' (default) draws a Catmull-Rom curve through the points;
  // 'sharp' connects them with straight segments instead — same data,
  // same points, just no curve-fitting.
  @Input() curve: CurveStyle = 'smooth';
  // Optional per-point labels (e.g. the same strings as the host's own
  // xAxisLabels) shown in the hover tooltip; purely cosmetic if omitted.
  @Input() xLabels: string[] = [];
  @Input() emptyText = 'No data available';

  @ViewChild('svgEl', { static: false }) svgRef?: ElementRef<SVGSVGElement>;

  // Internal coordinate system — independent of the actual rendered pixel
  // box (the <svg> stretches to fill its container via
  // preserveAspectRatio="none", see the template), so all path math below
  // stays simple regardless of the host card's real dimensions.
  readonly vbWidth = 1000;
  readonly vbHeight = 400;

  plotted: PlottedSeries[] = [];
  plottedThresholds: PlottedThreshold[] = [];
  hoverIndex: number | null = null;
  hoverSeriesKey: string | null = null;

  get hasData(): boolean {
    return this.series.length > 0 && this.series.some(s => s.values.some(v => v != null));
  }

  get pointCount(): number {
    return this.series.reduce((max, s) => Math.max(max, s.values.length), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.recompute();
  }

  private xFor(i: number, n: number): number {
    return n <= 1 ? this.vbWidth / 2 : (i / (n - 1)) * this.vbWidth;
  }

  private yFor(v: number): number {
    const span = this.yMax - this.yMin || 1;
    const clamped = Math.max(this.yMin, Math.min(this.yMax, v));
    const t = (clamped - this.yMin) / span;
    return this.vbHeight - t * this.vbHeight; // invert: larger value -> smaller y (SVG y grows downward)
  }

  private recompute(): void {
    this.plotted = this.series.map((s, si) => {
      const n = s.values.length;
      const points: PlottedPoint[] = s.values.map((v, i) => ({
        x: this.xFor(i, n),
        y: this.yFor(v ?? this.yMin),
        value: v,
      }));
      const gradientId = `slc-grad-${this.uid}-${si}`;
      const lineD = this.curve === 'sharp' ? this.sharpLinePath(points) : this.smoothLinePath(points);
      return {
        key: s.key,
        label: s.label,
        color: s.color,
        gradientId,
        lineD,
        areaD: this.areaPathFromLine(lineD, points),
        points,
      };
    });
    this.plottedThresholds = this.thresholds.map(t => ({
      y: this.yFor(t.value),
      color: t.color,
      label: t.label,
      value: t.value,
    }));
  }

  // Catmull-Rom spline through the given points, expressed as a cubic
  // bezier path — gives smooth curves through every real data point
  // (unlike a naive quadratic-midpoint smoother) without pulling in a
  // charting library.
  private smoothLinePath(points: PlottedPoint[]): string {
    if (!points.length) { return ''; }
    if (points.length === 1) { return `M ${points[0].x} ${points[0].y}`; }
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 < points.length ? i + 2 : i + 1];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  // Straight-segment path — same points as smoothLinePath, no curve-fitting.
  private sharpLinePath(points: PlottedPoint[]): string {
    if (!points.length) { return ''; }
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  }

  private areaPathFromLine(lineD: string, points: PlottedPoint[]): string {
    if (!lineD || points.length < 2) { return ''; }
    const first = points[0];
    const last = points[points.length - 1];
    return `${lineD} L ${last.x} ${this.vbHeight} L ${first.x} ${this.vbHeight} Z`;
  }

  onPointerMove(evt: MouseEvent): void {
    const svg = this.svgRef?.nativeElement;
    const n = this.pointCount;
    if (!svg || !n) { return; }
    const rect = svg.getBoundingClientRect();
    if (!rect.width) { return; }
    const relX = (evt.clientX - rect.left) / rect.width;
    const idx = Math.round(relX * (n - 1));
    this.hoverIndex = Math.max(0, Math.min(n - 1, idx));
  }

  onPointerLeave(): void {
    this.hoverIndex = null;
    this.hoverSeriesKey = null;
  }

  onSeriesHover(key: string | null): void {
    this.hoverSeriesKey = key;
  }

  // Percent-based left position for the HTML tooltip overlay (which sits in
  // real pixel space, not the SVG's internal viewBox units).
  hoverXPercent(): number {
    const n = this.pointCount;
    if (this.hoverIndex == null || n <= 1) { return 50; }
    return (this.hoverIndex / (n - 1)) * 100;
  }

  hoverLabel(): string {
    if (this.hoverIndex == null) { return ''; }
    return this.xLabels[this.hoverIndex] ?? '';
  }

  formatValue(v: number | null | undefined): string {
    if (v == null) { return '—'; }
    return String(Math.round(v * 10) / 10);
  }
}
