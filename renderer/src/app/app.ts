import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DocumentList} from './document-list/document-list';
import {DocumentPreview} from './document-preview/document-preview';
import {Filters} from './filters/filters';
import { Layout } from './layout/layout';
import { Sidebar } from './sidebar/sidebar';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DocumentList, DocumentPreview, Filters, Layout, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App implements OnInit {
  private api = (window as any).electronAPI;
  message: string = 'prova';

  constructor(
    private readonly cdr: ChangeDetectorRef
  ) { }

  async test(): Promise<void> {
    const res = await this.api.dip.autoImport();
    if (res.error) throw new Error(res.error);
  }

  async ngOnInit() {
    try {
      await this.test();
      this.message = 'worka';
    } catch (e) {
      this.message = (e as Error).message;
    } finally {
      this.cdr.detectChanges();
    }
  }
}