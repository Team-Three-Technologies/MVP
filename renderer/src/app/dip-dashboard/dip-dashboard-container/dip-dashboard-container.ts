import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DocumentList } from '../../components/document-list/document-list';
import { DocumentPreview } from '../../components/document-preview/document-preview';
import { Filters } from '../../components/filters/filters';
import { DipDetails } from '../../components/dip-details/dip-details';
import { DocumentDetails } from '../../components/document-details/document-details';
import { SearchFilterDTO } from '@shared/request/search.request.dto';
import {
  AttachmentResponseDTO,
  DocumentDetailsResponseDTO,
} from '@shared/response/document-details.response.dto';
import {
  DipContentResponseDTO,
  DocumentEssentialsDTO,
} from '@shared/response/dip-content.response.dto';
import { DocumentIntegrityResponseDTO } from '@shared/response/document-integrity.response.dto';
import { ElectronIpc } from '../../services/electron-ipc';

@Component({
  selector: 'app-dip-dashboard-container',
  imports: [DocumentList, DocumentPreview, Filters, DipDetails, DocumentDetails],
  templateUrl: './dip-dashboard-container.html',
  styleUrl: './dip-dashboard-container.css',
})
export class DipDashboardContainer implements OnInit, OnDestroy {
  private readonly electronIpc = inject(ElectronIpc);

  private _selectedDocumentState = signal<DocumentDetailsResponseDTO | null>(null);
  public selectedDocument = this._selectedDocumentState.asReadonly();

  private _selectedAllegatoState = signal<AttachmentResponseDTO | null>(null);
  public selectedAllegato = this._selectedAllegatoState.asReadonly();

  private _dipInfo = signal<DipContentResponseDTO | null>(null);
  public dipInfo = this._dipInfo.asReadonly();

  private _documentList = signal<DocumentEssentialsDTO[]>([]);
  public documentList = this._documentList.asReadonly();

  private _isListLoading = signal<boolean>(false);
  public isListLoading = this._isListLoading.asReadonly();

  private _isDetailsLoading = signal<boolean>(false);
  public isDetailsLoading = this._isDetailsLoading.asReadonly();

  public errorMessage = signal<string | null>(null);

  private _documentFileUrl = signal<string | null>(null);
  public documentFileUrl = this._documentFileUrl.asReadonly();

  private _isLoadingPreview = signal<boolean>(false);
  public isLoadingPreview = this._isLoadingPreview.asReadonly();

  private _previewSelectedDocumentState = signal<{ name: string } | null>(null);
  public previewSelectedDocument = this._previewSelectedDocumentState.asReadonly();

  private _previewItemFormato = signal<string | null>(null);
  public previewItemFormato = this._previewItemFormato.asReadonly();

  private _integrityMap = signal<Map<string, boolean>>(new Map());
  public integrityMap = this._integrityMap.asReadonly();

  public async onDocumentSelected(id: string): Promise<void> {
    await this.selectDocument(id);
  }

  public async onAttachmentSelected(event: {
    documentUuid: string;
    attachmentUuid: string;
  }): Promise<void> {
    await this.selectAllegato(event.documentUuid, event.attachmentUuid);
  }

  public async ngOnInit(): Promise<void> {
    await this.autoImport();
  }

  public async onSearch(filters: SearchFilterDTO[]): Promise<void> {
    await this.searchDocuments(filters);
  }

  public ngOnDestroy(): void {
    this.clearSelection();
  }

  public async onItemPreview(item: {
    documentUuid: string;
    attachmentUuid?: string;
  }): Promise<void> {
    await this.previewSelect(item.documentUuid, item.attachmentUuid);
  }

  public closePreview(): void {
    this.clearPreview();
  }

  public async onExport(event: { documentUuid: string; fileUuid?: string }): Promise<void> {
    await this.exportFile(event.documentUuid, event.fileUuid);
  }

  private async loadDipInfo(dipUuid: string): Promise<void> {
    try {
      const dipInfo = await this.electronIpc.content({ dipUuid });
      this._dipInfo.set(dipInfo);
      this._documentList.set(dipInfo.documentsList);
      // await this.loadIntegrity(dipUuid);
    } catch (error) {
      console.error('Error loading dip info:', error);
      this.errorMessage.set('Failed to load dip info. Please try again.');
    }
  }

  // private async loadIntegrity(dipUuid: string): Promise<void> {
  //   try {
  //     const integrity = await this.electronIpc.checkIntegrity({ dipUuid });
  //     this._integrityMap.set(this._buildIntegrityMap(integrity));
  //   } catch (error) {
  //     console.error('Error checking integrity:', error);
  //   }
  // }

  // private _buildIntegrityMap(integrity: DipIntegrityResponseDTO): Map<string, boolean> {
  //   const map = new Map<string, boolean>();
  //   for (const doc of integrity.documents) {
  //     map.set(doc.integrity.uuid, doc.integrity.status);
  //     for (const att of doc.attachments) {
  //       map.set(att.uuid, att.status);
  //     }
  //   }
  //   return map;
  // }

  private async selectDocument(id: string): Promise<void> {
    this._isDetailsLoading.set(true);
    this._selectedDocumentState.set(null);
    this._selectedAllegatoState.set(null);
    try {
      const details = await this.electronIpc.getDocumentDetails({ documentUuid: id });
      this._selectedDocumentState.set(details);
    } catch (error) {
      console.error('Error loading document details:', error);
      this.errorMessage.set('Failed to load document details.');
    } finally {
      this._isDetailsLoading.set(false);
    }
  }

  private async selectAllegato(documentUuid: string, allegatoUuid: string): Promise<void> {
    this._isDetailsLoading.set(true);
    this._selectedDocumentState.set(null);
    this._selectedAllegatoState.set(null);
    try {
      const details = await this.electronIpc.getDocumentDetails({ documentUuid });
      const allegato = details.attachments.find((a) => a.uuid === allegatoUuid);
      if (allegato) {
        this._selectedAllegatoState.set(allegato);
      } else {
        this.errorMessage.set('Allegato non trovato nel documento.');
      }
    } catch (error) {
      console.error('Error loading attachment details:', error);
      this.errorMessage.set('Failed to load attachment details.');
    } finally {
      this._isDetailsLoading.set(false);
    }
  }

  private async previewSelect(documentUuid: string, fileUuid?: string): Promise<void> {
    this._isLoadingPreview.set(true);
    this._documentFileUrl.set(null);
    try {
      const details = await this.electronIpc.getDocumentDetails({ documentUuid });

      let targetName = details.name;
      let targetExtension = details.extension?.toLowerCase();

      if (fileUuid) {
        const allegato = details.attachments.find((a) => a.uuid === fileUuid);
        if (allegato) {
          targetName = allegato.path.split('/').pop() || allegato.path;
          targetExtension = allegato.extension?.toLowerCase();
        }
      }

      const supportedInternalFormats = ['pdf', 'png', 'jpg', 'jpeg', 'webp', 'gif'];

      if (targetExtension && !supportedInternalFormats.includes(targetExtension)) {
        await this.electronIpc.fileExternalPreview({ documentUuid, fileUuid });
        this.clearPreview();
        return;
      }

      this._previewSelectedDocumentState.set({ name: targetName });
      this._previewItemFormato.set(targetExtension || 'pdf');

      const { fileUrl } = await this.electronIpc.fileInternalPreview({ documentUuid, fileUuid });
      this._documentFileUrl.set(fileUrl);
    } catch (error) {
      console.error('Errore preview interna, provo esterna:', error);
      try {
        await this.electronIpc.fileExternalPreview({ documentUuid, fileUuid });
        this.clearPreview();
      } catch (extError) {
        this.errorMessage.set("Impossibile caricare l'anteprima.");
      }
    } finally {
      this._isLoadingPreview.set(false);
    }
  }

  private async searchDocuments(filters: SearchFilterDTO[]): Promise<void> {
    this.clearSelection();
    this._isListLoading.set(true);
    this.errorMessage.set(null);

    try {
      if (filters.length === 0) {
        const dip = this.dipInfo();
        if (dip) {
          this._documentList.set(dip.documentsList);
        }
        return;
      }
      const response = await this.electronIpc.searchDocuments({ filters });
      this._documentList.set(response.results);
    } catch (error) {
      console.error('Error searching documents:', error);
      this.errorMessage.set('Failed to search documents. Please try again.');
    } finally {
      this._isListLoading.set(false);
    }
  }

  private clearSelection(): void {
    this._selectedDocumentState.set(null);
    this._selectedAllegatoState.set(null);
    void this.clearPreview();
  }

  private clearPreview(): void {
    this._previewSelectedDocumentState.set(null);
    this._previewItemFormato.set(null);
    this._documentFileUrl.set(null);
  }

  private async exportFile(documentUuid: string, fileUuid?: string): Promise<void> {
    this._isDetailsLoading.set(true);
    try {
      await this.electronIpc.exportFile({ documentUuid, fileUuid });
    } catch (error) {
      console.error('Error exporting file:', error);
      this.errorMessage.set('Failed to export file. Please try again.');
    } finally {
      this._isDetailsLoading.set(false);
    }
  }

  private async autoImport(): Promise<void> {
    this._isListLoading.set(true);
    this.errorMessage.set(null);
    try {
      const response = await this.electronIpc.autoImport();
      await this.loadDipInfo(response.dipUuid);
    } catch (error) {
      console.error('Error auto importing:', error);
      this.errorMessage.set((error as Error).message);
    } finally {
      this._isListLoading.set(false);
    }
  }
}
