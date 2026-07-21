import { Component, EventEmitter, Input, HostListener, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

type PreferenceTab = 'applications' | 'glanceable';

@Component({
  selector: 'app-user-preference-modal',
  templateUrl: './user-preference-modal.component.html',
  styleUrls: ['./user-preference-modal.component.scss']
})
export class UserPreferenceModalComponent {

  @Output() close = new EventEmitter<void>();

  // Owned by LandingComponent so the tile row can reflect the same live
  // arrays — CDK's moveItemInArray/transferArrayItem mutate these in place,
  // so the parent sees drag-and-drop changes immediately, no separate sync
  // step needed.
  @Input() availableGlanceable: string[] = [];
  @Input() selectedGlanceable: string[] = [];

  activeTab: PreferenceTab = 'glanceable';

  minimizeGlanceableItem = false;

  setTab(tab: PreferenceTab): void {
    this.activeTab = tab;
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onBackdropClick(): void {
    this.close.emit();
  }

  onDone(): void {
    console.log('Saved preferences:', {
      selectedGlanceable: this.selectedGlanceable,
      minimizeGlanceableItem: this.minimizeGlanceableItem,
    });
    // TODO: persist the selection once a preferences endpoint exists
    this.close.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }
}
