import { Injectable, inject } from '@angular/core';
import {
  AttachmentResponseDTO,
  DocumentDetailsResponseDTO,
} from '@shared/response/document-details.response.dto';
import { BackendFacade } from '../facades/backend.facade';
import { FilterModel } from '../models/filter';
import { DipInfoModel } from '../models/dip-info';

@Injectable()
export class DipPresenter {
  private readonly facade = inject(BackendFacade);
  public dipInfo = this.facade.dipInfo;
  public documentList = this.facade.documentList;
  public selectedDocumentState = this.facade.selectedDocumentState;
  public selectedAllegatoState = this.facade.selectedAllegatoState;
  public isLoading = this.facade.isLoading;
  public documentFileUrl = this.facade.documentFileUrl;
  public isLoadingPreview = this.facade.isLoadingPreview;
  public errorMessage = this.facade.errorMessage;
  public previewSelectedDocumentState = this.facade.previewSelectedDocumentState;
  public previewItemFormato = this.facade.previewItemFormato;

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
    } catch (error) {
      console.error('Error in presenter while selecting document:', error);
    }
  }

  async selectAllegato(allegato: AttachmentResponseDTO): Promise<void> {
    try {
      await this.facade.selectAllegato(allegato);
    } catch (error) {
      console.error('Error in presenter while selecting allegato:', error);
    }
  }

  async loadDocuments(): Promise<void> {
    await this.facade.loadDocuments();
  }

  async loadDocumentFile(doc: DocumentDetailsResponseDTO): Promise<void> {
    await this.facade.loadDocumentFile(doc);
  }

  async clearSelection(): Promise<void> {
    await this.facade.clearSelection();
  }

  async previewDocument(item: DocumentDetailsResponseDTO | AttachmentResponseDTO): Promise<void> {
    try {
      await this.facade.previewSelect(item);
    } catch (error) {
      console.error('Error in presenter while previewing document:', error);
    }
  }

  async closePreview(): Promise<void> {
    await this.facade.clearPreview();
  }

  async loadDipInfo(): Promise<void> {
    await this.facade.loadDipInfo();
  }
}
