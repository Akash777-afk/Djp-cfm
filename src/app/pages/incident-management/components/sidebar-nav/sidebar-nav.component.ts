import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.component.html',
  styleUrls: ['./sidebar-nav.component.scss']
})
export class SidebarNavComponent {

  constructor(private router: Router, private authService: AuthService) {}

  goToDashboard(): void {
    this.router.navigate(['/']);
  }

  onLsiSearch(): void {
    console.log('LSI Search clicked');
    // TODO: wire up once the LSI Search destination is defined
  }

  onFeedback(): void {
    console.log('Feedback clicked');
    // TODO: wire up once the Feedback destination is defined
  }

  goToEscalation(): void {
    this.router.navigate(['/escalation-matrix']);
  }

  logout(): void {
    this.authService.logout();
  }
}
