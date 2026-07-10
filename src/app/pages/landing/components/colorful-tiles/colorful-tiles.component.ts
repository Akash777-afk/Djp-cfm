import { Component, Input } from '@angular/core';
import { ModuleKey, SectionVariant } from '../../landing.types';

@Component({
  selector: 'app-colorful-tiles',
  templateUrl: './colorful-tiles.component.html',
  styleUrls: ['./colorful-tiles.component.scss']
})
export class ColorfulTilesComponent {

  @Input() variant: SectionVariant = 'desktop';

  // Drives the mobile/tablet responsive nav grid (.mobile-layout). The
  // desktop canvas keeps its own hardcoded per-tile markup untouched.
  moduleTiles: { key: ModuleKey; label: string; subtitle: string; icon: string; gradientClass: string }[] = [
    { key: 'noc-portal',            label: 'NOC Portal',            subtitle: 'Network Operations Center',      icon: '/assets/tile-1.svg', gradientClass: 'tile-noc' },
    { key: 'proactive-automation',  label: 'Proactive Automation',  subtitle: 'Automated workflows',            icon: '/assets/tile-2.svg', gradientClass: 'tile-automation' },
    { key: 'incident-management',   label: 'Incident Management',   subtitle: 'Track and resolve Incidents',    icon: '/assets/tile-3.svg', gradientClass: 'tile-incident' },
    { key: 'problem-management',    label: 'Problem Management',    subtitle: 'Analyzing the root cause',       icon: '/assets/tile-4.svg', gradientClass: 'tile-problem' },
    { key: 'change-management',     label: 'Change Management',     subtitle: 'Manage system changes',          icon: '/assets/tile-5.svg', gradientClass: 'tile-change' },
  ];

  navigateToModule(moduleKey: ModuleKey): void {
    console.log('Navigate to module:', moduleKey);
    // TODO: replace with real navigation, e.g. this.router.navigate(['/', moduleKey]);
  }
}
