import { Injectable, inject } from '@angular/core';
import { DocumentModel } from '../models/document';
import { BackendFacade } from '../facades/backend.facade';
import { FilterModel } from '../models/filter';

@Injectable()
export class DipPresenter {
  private readonly facade = inject(BackendFacade);
  public documentList = this.facade.documentList;
  public selectedDocumentState = this.facade.selectedDocumentState;
  public isLoading = this.facade.isLoading;
  public documentFileUrl = this.facade.documentFileUrl;
  public isLoadingPreview = this.facade.isLoadingPreview;
  public errorMessage = this.facade.errorMessage;

  async searchDocuments(filters: FilterModel[]): Promise<void> {
    try {
    await this.facade.searchDocuments(filters);
    } catch (error) {
      console.error('Error in presenter while searching documents:', error);
      this.errorMessage.set('An error occurred while searching documents. Please try again.');
    }
  }

  async selectDocument(id: string): Promise<void> {
    try {
      await this.facade.selectDocument(id);
      const doc = this.facade.selectedDocumentState();
      if (doc) {
        await this.facade.loadDocumentFile(doc);
      }
    } catch (error) {
      console.error('Error in presenter while selecting document:', error);
    }

  }

  async loadDocuments(): Promise<void> {
    await this.facade.loadDocuments();
  }

  async loadDocumentFile(doc: DocumentModel): Promise<void> {
    await this.facade.loadDocumentFile(doc);
  }

  async clearSelection(): Promise<void> {
    await this.facade.clearSelection();
  }
}
