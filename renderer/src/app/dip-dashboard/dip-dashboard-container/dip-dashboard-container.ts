import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { DocumentList } from '../../components/document-list/document-list';
import { DocumentPreview } from '../../components/document-preview/document-preview';
import { Filters } from '../../components/filters/filters';
import { DipDetails } from '../../components/dip-details/dip-details';
import { DocumentDetails } from '../../components/document-details/document-details';
import { FilterModel } from '../../models/filter';
import { DipPresenter } from '../../presenters/dip-presenter';
import {
  AttachmentResponseDTO,
  DocumentDetailsResponseDTO,
} from '@shared/response/document-details.response.dto';

@Component({
  selector: 'app-dip-dashboard-container',
  imports: [DocumentList, DocumentPreview, Filters, DipDetails, DocumentDetails],
  providers: [DipPresenter],
  templateUrl: './dip-dashboard-container.html',
  styleUrl: './dip-dashboard-container.css',
})
export class DipDashboardContainer implements OnInit, OnDestroy {
  private presenter = inject(DipPresenter);
  public dipInfo = this.presenter.dipInfo;
  public documentList = this.presenter.documentList;
  public selectedDocument = this.presenter.selectedDocumentState;
  public selectedAllegato = this.presenter.selectedAllegatoState;
  public isLoading = this.presenter.isLoading;
  public documentFileUrl = this.presenter.documentFileUrl;
  public isLoadingPreview = this.presenter.isLoadingPreview;
  public previewSelectedDocument = this.presenter.previewSelectedDocumentState;
  public previewItemFormato = this.presenter.previewItemFormato;

  public async onDocumentSelected(id: string): Promise<void> {
    await this.presenter.selectDocument(id);
  }

  public async onAttachmentSelected(event: {
    doc: DocumentDetailsResponseDTO;
    allegato: AttachmentResponseDTO;
  }): Promise<void> {
    await this.presenter.selectAllegato(event.allegato);
  }

  public async ngOnInit(): Promise<void> {
    await this.presenter.loadDocuments();
    await this.presenter.loadDipInfo();
  }
  public async onSearch(filters: FilterModel[]): Promise<void> {
    await this.presenter.searchDocuments(filters);
  }

  public async ngOnDestroy(): Promise<void> {
    await this.presenter.clearSelection();
  }

  public async onItemPreview(
    item: DocumentDetailsResponseDTO | AttachmentResponseDTO,
  ): Promise<void> {
    await this.presenter.previewDocument(item);
  }

  public async closePreview(): Promise<void> {
    await this.presenter.closePreview();
  }
}
