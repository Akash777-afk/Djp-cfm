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

  // Close the user dropdown when clicking anywhere outside it
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isUserMenuOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isUserMenuOpenChange.emit(false);
    }
  }
}
