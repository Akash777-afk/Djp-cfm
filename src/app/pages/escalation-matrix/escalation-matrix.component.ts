import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EscalationLevelTile } from './components/escalation-levels/escalation-levels.component';
import { EscalatedSrRow } from './components/escalated-srs/escalated-srs.component';
import { EscalationMatrixService } from './services/escalation-matrix.service';
import { SessionService } from '../../services/session.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-escalation-matrix',
  templateUrl: './escalation-matrix.component.html',
  styleUrls: ['./escalation-matrix.component.scss']
})
export class EscalationMatrixComponent implements OnInit {

  constructor(
    private router: Router,
    private emService: EscalationMatrixService,
    private session: SessionService,
    private loadingService: LoadingService,
  ) {}

  private static readonly DESIGN_WIDTH = 1920;
  scale = 1;

  ngOnInit(): void {
    this.updateScale();
    this.fetchDashboard();

  
    this.session.getCurrentUser().subscribe(user => {
      const name = user?.userData?.givenName;
      if (name) { this.userName = name; }
    });
    this.session.logActivity({
      System: 'Escalation Matrix',
      'OLM ID': this.userName,
      Action: 'View',
      Comments: 'User viewed Escalation Matrix dashboard',
    }).subscribe();
  }

  @HostListener('window:resize')
  updateScale(): void {
    this.scale = Math.min(window.innerWidth / EscalationMatrixComponent.DESIGN_WIDTH, 1);
  }
  userName = 'Akash Ganapathy2';

  onCallClick(): void {
    console.log('Call clicked');
  }
  onBookClick(): void {
    console.log('Book clicked');
  }

  isLoading = true;
  levelTiles: EscalationLevelTile[] = [];
  srRows: EscalatedSrRow[] = [];

  private fetchDashboard(): void {
    this.isLoading = true;
    this.loadingService.show();
    this.emService.getDashboardData().subscribe(({ levelTiles, srRows }) => {
      this.levelTiles = levelTiles;
      this.srRows = srRows;
      this.isLoading = false;
      this.loadingService.hide();
    });
  }

  onTableRefresh(): void {
    this.fetchDashboard();
  }

  onRowClick(row: EscalatedSrRow): void {
    this.router.navigate(['/noc-portal'], { queryParams: { SrNumber: row.srNumber } });
  }

  // LSI hyperlink — same in-app NOC Portal navigation pattern as the SR
  // Number link, using DJP's own real query param name for an LSI lookup
  // ("lsinumber", same convention Change Management's Contact Centre
  // navigation already uses) rather than the SR-focused one.
  onLsiClick(row: EscalatedSrRow): void {
    this.router.navigate(['/noc-portal'], { queryParams: { lsinumber: row.lsi } });
  }

  activeCardKey = 'all';

  setActiveCard(key: string): void {
    this.activeCardKey = key;
  }

  // null = no filter (show every row), matching the 'all' tile.
  get levelFilter(): number | null {
    if (this.activeCardKey === 'all') { return null; }
    return Number(this.activeCardKey.replace('level-', ''));
  }
}
