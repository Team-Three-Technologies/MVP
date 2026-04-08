import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { BackendFacade } from '../../facades/backend.facade';
import { DocumentList } from '../../components/document-list/document-list';
import { DocumentPreview } from '../../components/document-preview/document-preview';
import { Filters } from '../../components/filters/filters';
import {DipDetails} from '../../components/dip-details/dip-details';
import { FilterModel } from '../../models/filter';

@Component({
  selector: 'app-dip-dashboard-container',
  imports: [DocumentList, DocumentPreview, Filters, DipDetails],
  templateUrl: './dip-dashboard-container.html',
  styleUrl: './dip-dashboard-container.css',
})
export class DipDashboardContainer implements OnInit, OnDestroy {
  private facade = inject(BackendFacade);
  public documentList = this.facade.documentList;
  public selectedDocument = this.facade.selectedDocumentState;
  public isLoading = this.facade.isLoading;

  public async onDocumentSelected(id: string): Promise<void> {
    await this.facade.selectDocument(id);
  }

  public async ngOnInit(): Promise<void> {
    await this.facade.loadDocuments();
  }
  public async onSearch(filters: FilterModel[]): Promise<void> {
    await this.facade.searchDocuments(filters);
  }

  public async ngOnDestroy(): Promise<void> {
    await this.facade.clearSelection();
  }
}
