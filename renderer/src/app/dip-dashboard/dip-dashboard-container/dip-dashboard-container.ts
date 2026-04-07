import { Component, inject } from '@angular/core';
import { BackendFacade } from 'src/app/components/facades/backend.facade';
import {DocumentList} from '../../components/document-list/document-list';
import {DocumentPreview} from '../../components/document-preview/document-preview';
import {Filters} from '../../components/filters/filters';
import { Filter } from 'src/app/dip-presenter';

@Component({
  selector: 'app-dip-dashboard-container',
  imports: [DocumentList, DocumentPreview, Filters],
  templateUrl: './dip-dashboard-container.html',
  styleUrl: './dip-dashboard-container.css',
})

export class DipDashboardContainer implements OnInit, OnDestroy {
  private facade=inject(BackendFacade);
  public documentList = this.facade.documentList;
  public selectedDocument = this.facade.selectedDocumentState;
  public isLoading = this.facade.isLoading;

  public async onDocumentSelected(id: string): Promise<void> {
    await this.facade.selectDocument(id);
  }

  public async ngOnInit(): Promise<void> {
    await this.facade.loadDocuments();
  }
   public async onSearch(filters: Filter[]): Promise<void> {
    await this.facade.searchDocuments(filters);
  }

  public async ngOnDestroy(): Promise<void> {
    await this.facade.clearSelection();
  }
}


