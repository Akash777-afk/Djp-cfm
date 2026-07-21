import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SectionVariant } from '../../landing.types';

@Component({
  selector: 'app-header-part',
  templateUrl: './header-part.component.html',
  styleUrls: ['./header-part.component.scss']
})
export class HeaderPartComponent {

  @Input() variant: SectionVariant = 'desktop';

  @Input() portalTitle = '';
  @Input() portalSubtitle = '';
  @Input() searchPlaceholder = '';

  @Input() searchQuery = '';
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() search = new EventEmitter<void>();

  @Input() userInitials = '';
  @Input() userName = '';
  @Input() userRole = '';

  @Input() isUserMenuOpen = false;
  @Output() isUserMenuOpenChange = new EventEmitter<boolean>();

  @Output() documentsClick = new EventEmitter<void>();
  @Output() notificationsClick = new EventEmitter<void>();
  @Output() userMenuAction = new EventEmitter<'preferences' | 'profile' | 'settings' | 'logout'>();

  constructor(private elementRef: ElementRef) {}

  onSearchQueryInput(value: string): void {
    this.searchQueryChange.emit(value);
  }

  onSearch(): void {
    this.search.emit();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpenChange.emit(!this.isUserMenuOpen);
  }

  onUserMenuAction(action: 'preferences' | 'profile' | 'settings' | 'logout'): void {
    this.userMenuAction.emit(action);
    this.isUserMenuOpenChange.emit(false);
  }

  // Close the user dropdown when clicking anywhere outside it.
  // Desktop and mobile variants of this component are both mounted at once
  // (CSS display:none hides the inactive one — see landing.component.scss),
  // so the hidden variant's own listener would otherwise see every click as
  // "outside" and immediately re-close the menu the visible variant just
  // opened. The host itself is `display: contents` (so it never gets a box
  // of its own — offsetParent/getClientRects on it are always null/empty
  // regardless of visibility), so check its rendered child instead: that's
  // a real element, and its offsetParent is null exactly when display:none
  // applies somewhere up the chain (i.e. this variant is the inactive one).
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const host = this.elementRef.nativeElement as HTMLElement;
    const child = host.firstElementChild as HTMLElement | null;
    const isVisible = !!child && child.offsetParent !== null;
    if (this.isUserMenuOpen && isVisible && !host.contains(event.target as Node)) {
      this.isUserMenuOpenChange.emit(false);
    }
  }
}
