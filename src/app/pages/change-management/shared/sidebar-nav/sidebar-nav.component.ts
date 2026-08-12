import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

// A bounded catalog of inline icon glyphs (drawn once here) plus a generic
// 'img' escape hatch for pages that have a real asset — new pages add items
// to this list rather than hardcoding a fixed 5-button menu, so this one
// sidebar shell can be reused (pixel-identical shape/shadow/hover) across
// every page that needs the red pill nav, not just Change Management.
export type SidebarIconKind = 'dashboard' | 'search' | 'alerts' | 'trending' | 'exit' | 'img';

export interface SidebarNavItem {
  key: string;
  label: string;
  icon: SidebarIconKind;
  iconSrc?: string; // required when icon === 'img'
}

// Shared by both Change Management pages (landing + CRQ) so their sidebars
// can't drift apart.
export const CM_SIDEBAR_ITEMS: SidebarNavItem[] = [
  { key: 'dashboard',       label: 'Dashboard',       icon: 'dashboard' },
  { key: 'lsi-search',      label: 'LSI Search',      icon: 'search' },
  { key: 'create-po',       label: 'Create PO',       icon: 'img', iconSrc: '/assets/change-management/plus.png' },
  { key: 'service-impact',  label: 'Service impact',  icon: 'img', iconSrc: '/assets/change-management/graph.png' },
  { key: 'contact-centre',  label: 'Contact centre',  icon: 'img', iconSrc: '/assets/change-management/contact.png' },
];

@Component({
  selector: 'app-cm-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss']
})
export class ChangeManagementSidebarNavComponent {

  constructor(private router: Router) {}

  // Matches the host page's --djp-scale/--cml-scale so the sidebar (deliberately
  // position:fixed, outside the scaled canvas, to survive scrolling) still
  // shrinks in sync with the rest of the page below 1920px viewports instead
  // of staying full-size and drifting out of place.
  @Input() scale = 1;

  // Distance from the viewport top, in px at scale 1. Change Management's
  // own header (app-cm-header-bar) is 122px tall (82px topbar + 40px
  // breadcrumb) — 108 is a deliberate ~14px tuck-under-the-header overlap
  // (see the header's own z-index comment), not the header's height.
  // Other hosts that want a real gap below their header should pass
  // header height + however much clearance they want, not just the
  // header height alone.
  @Input() top = 108;

  @Input() items: SidebarNavItem[] = [];

  // 'dashboard' always means "go to the landing page" everywhere it's used,
  // so that one's handled here directly; everything else is page-specific
  // and bubbles up for the host page to decide what it means.
  @Output() itemClick = new EventEmitter<string>();

  onItemClick(item: SidebarNavItem): void {
    if (item.key === 'dashboard') {
      this.router.navigate(['/']);
      return;
    }
    this.itemClick.emit(item.key);
  }
}
