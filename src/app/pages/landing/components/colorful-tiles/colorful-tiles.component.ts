import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModuleKey, SectionVariant } from '../../landing.types';

@Component({
  selector: 'app-colorful-tiles',
  templateUrl: './colorful-tiles.component.html',
  styleUrls: ['./colorful-tiles.component.scss']
})
export class ColorfulTilesComponent {

  constructor(private router: Router) {}

  @Input() variant: SectionVariant = 'desktop';

  // Drives the mobile/tablet responsive nav grid (.mobile-layout). The
  // desktop canvas keeps its own hardcoded per-tile markup untouched.
  moduleTiles: { key: ModuleKey; label: string; subtitle: string; icon: string; gradientClass: string }[] = [
    { key: 'noc-portal',            label: 'NOC Portal',            subtitle: 'Network Operations Center',      icon: '/assets/tile-1.svg', gradientClass: 'tile-noc' },
    { key: 'proactive-automation',  label: 'Proactive Automation',  subtitle: 'Automated workflows',            icon: '/assets/tile-2.svg', gradientClass: 'tile-automation' },
    { key: 'incident-management',   label: 'Incident Management',   subtitle: 'Track and resolve Incidents',    icon: '/assets/tile-3.svg', gradientClass: 'tile-incident' },
    { key: 'problem-management',    label: 'Problem Management',    subtitle: 'Analyzing the root cause',       icon: '/assets/tile-4.svg', gradientClass: 'tile-problem' },
    { key: 'change-management',     label: 'Change Management',     subtitle: 'Manage system changes',          icon: '/assets/tile-5.svg', gradientClass: 'tile-change' },
    { key: 'rooster-management',    label: 'Rooster Management',    subtitle: 'Team scheduling',                icon: '/assets/tile-6.svg', gradientClass: 'tile-rooster' },
    { key: 'escalation-matrix',     label: 'Escalation Matrix',     subtitle: 'Detailed escalation reports',    icon: '/assets/tile-7.svg', gradientClass: 'tile-escalation' },
    { key: 'sr-assign-reassign',    label: 'SR Assign & Reassign',  subtitle: 'View service requests',          icon: '/assets/tile-8.svg', gradientClass: 'tile-sr-assign' },
  ];

  navigateToModule(moduleKey: ModuleKey): void {
    if (moduleKey === 'incident-management') {
      this.router.navigate(['/incident-management']);
      return;
    }
    console.log('Navigate to module:', moduleKey);
    // TODO: replace with real navigation once the other module pages exist
  }

  // Drives the prev/next arrow buttons on the desktop tile row.
  tilesAtStart = true;
  tilesAtEnd = false;

  scrollTiles(row: HTMLElement, direction: 1 | -1): void {
    row.scrollBy({ left: direction * row.clientWidth * 0.9, behavior: 'smooth' });
  }

  onTilesScroll(row: HTMLElement): void {
    this.tilesAtStart = row.scrollLeft <= 0;
    this.tilesAtEnd = row.scrollLeft + row.clientWidth >= row.scrollWidth - 1;
  }
}
