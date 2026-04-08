import { Component, inject, OnInit } from '@angular/core';
import { DipDashboardContainer } from './dip-dashboard/dip-dashboard-container/dip-dashboard-container';
import { BackendFacade } from './facades/backend.facade';

@Component({
  selector: 'app-root',
  imports: [DipDashboardContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App implements OnInit {
  private backendFacade = inject(BackendFacade);

  async ngOnInit() {
    await this.backendFacade.autoImport();
  }
}
