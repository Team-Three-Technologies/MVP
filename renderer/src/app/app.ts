import { Component } from '@angular/core';
import { DipDashboardContainer } from './dip-dashboard/dip-dashboard-container/dip-dashboard-container';

@Component({
  selector: 'app-root',
  imports: [DipDashboardContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
