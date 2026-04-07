import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Layout } from './layout/layout';
import { Sidebar } from './sidebar/sidebar';
import { BackendFacade } from './components/facades/backend.facade';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Layout, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App implements OnInit {
  private backendFacade = inject(BackendFacade);

  async ngOnInit() {
    await this.backendFacade.autoImport();
  }
}