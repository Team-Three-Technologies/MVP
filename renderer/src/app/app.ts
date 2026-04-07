import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DocumentList} from './components/document-list/document-list';
import {DocumentPreview} from './components/document-preview/document-preview';
import {Filters} from './components/filters/filters';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DocumentList, DocumentPreview, Filters],
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