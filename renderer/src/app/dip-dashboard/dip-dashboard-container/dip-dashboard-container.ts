import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DocumentList } from '../../components/document-list/document-list';
import { DocumentPreview } from '../../components/document-preview/document-preview';
import { Filters } from '../../components/filters/filters';
import { DipDetails } from '../../components/dip-details/dip-details';
import { DocumentDetails } from '../../components/document-details/document-details';
import { SearchFilterDTO } from '@shared/request/search-filter.request.dto';
import { BackendFacade } from '../../facades/backend.facade';
import {
  AttachmentResponseDTO,
  DocumentDetailsResponseDTO,
} from '@shared/response/document-details.response.dto';

@Component({
  selector: 'app-dip-dashboard-container',
  imports: [DocumentList, DocumentPreview, Filters, DipDetails, DocumentDetails],
  templateUrl: './dip-dashboard-container.html',
  styleUrl: './dip-dashboard-container.css',
})
export class DipDashboardContainer implements OnInit, OnDestroy {
  private facade = inject(BackendFacade);
  public dipInfo = this.facade.dipInfo;
  public documentList = this.facade.documentList;
  public selectedDocument = this.facade.selectedDocumentState;
  public selectedAllegato = this.facade.selectedAllegatoState;
  public isLoading = this.facade.isLoading;
  public errorMessage = this.facade.errorMessage;
  public documentFileUrl = this.facade.documentFileUrl;
  public isLoadingPreview = this.facade.isLoadingPreview;
  public previewSelectedDocument = this.facade.previewSelectedDocumentState;
  public previewItemFormato = this.facade.previewItemFormato;

  public async onDocumentSelected(id: string): Promise<void> {
    this.facade.selectDocument(id);
  }

  public async onAttachmentSelected(event: {
    doc: DocumentDetailsResponseDTO;
    allegato: AttachmentResponseDTO;
  }): Promise<void> {
    this.facade.selectAllegato(event.allegato);
  }

  public async ngOnInit(): Promise<void> {
    await this.facade.loadDocuments();
    await this.facade.loadDipInfo();
  }

  public async onSearch(filters: SearchFilterDTO[]): Promise<void> {
    await this.facade.searchDocuments(filters);
  }

  public async ngOnDestroy(): Promise<void> {
    this.facade.clearSelection();
  }

  public async onItemPreview(
    item: DocumentDetailsResponseDTO | AttachmentResponseDTO,
  ): Promise<void> {
    await this.facade.previewSelect(item);
  }

  public async closePreview(): Promise<void> {
    await this.facade.clearPreview();
  }
}
