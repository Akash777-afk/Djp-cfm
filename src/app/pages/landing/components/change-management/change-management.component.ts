import { Component, Input } from '@angular/core';
import { ChangeRow, SectionVariant } from '../../landing.types';

@Component({
  selector: 'app-landing-change-management',
  templateUrl: './change-management.component.html',
  styleUrls: ['./change-management.component.scss']
})
export class ChangeManagementCardComponent {

  @Input() variant: SectionVariant = 'desktop';

  // Position within the reorderable 2x2 grid, supplied by LandingComponent.
  @Input() top = 0;
  @Input() left = 0;
  @Input() order = 0;

  changeCardTitle    = 'Change management';
  changeCardSubtitle = 'Control network changes with secure approvals and seamless execution.';

  changeRows: ChangeRow[] = [
    { outageId: '110039400', crq: 'CRQ000005963007', impact: 'Service affecting', implementor: 'A11YUHO@airtel.com', submitted: true,  isLast: false },
    { outageId: '110039431', crq: 'CRQ000005963008', impact: 'Service affecting', implementor: 'A12IUGP@airtel.com', submitted: true,  isLast: false },
    { outageId: '110039442', crq: 'CRQ000005963011', impact: 'Service affecting', implementor: 'A13JKFJ@airtel.com', submitted: false, isLast: false },
    { outageId: '110039478', crq: 'CRQ000005963016', impact: 'Service affecting', implementor: 'A14KUYh@airtel.com', submitted: true,  isLast: true  },
  ];

  onExpandCard(): void {
    console.log('Expand card: change');
    // TODO: open a full-screen modal / dedicated route for this card
  }
}
