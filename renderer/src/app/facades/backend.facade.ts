import { Injectable, inject } from '@angular/core';
import {
  AttachmentResponseDTO,
  DocumentDetailsResponseDTO,
} from '@shared/response/document-details.response.dto';
import { DipContentResponseDTO } from '@shared/response/dip-details.response.dto';
import { signal } from '@angular/core';
import { ElectronIpc } from '../services/electron-ipc';
import { FilterModel } from '../models/filter';
@Injectable({
  providedIn: 'root',
})
export class BackendFacade {
  private readonly electronIpc = inject(ElectronIpc);
  private _selectedDocumentState = signal<DocumentDetailsResponseDTO | null>(null);
  public selectedDocumentState = this._selectedDocumentState.asReadonly();
  public errorMessage = signal<string | null>(null);
  private _documentList = signal<DocumentDetailsResponseDTO[]>([]);
  public documentList = this._documentList.asReadonly();
  private _isLoading = signal<boolean>(false);
  public isLoading = this._isLoading.asReadonly();
  private _documentFileUrl = signal<string | null>(null);
  public documentFileUrl = this._documentFileUrl.asReadonly();
  private _isLoadingPreview = signal<boolean>(false);
  public isLoadingPreview = this._isLoadingPreview.asReadonly();
  private _previewSelectedDocumentState = signal<DocumentDetailsResponseDTO | null>(null);
  public previewSelectedDocumentState = this._previewSelectedDocumentState.asReadonly();
  private _previewItemFormato = signal<string | null>(null);
  public previewItemFormato = this._previewItemFormato.asReadonly();
  private _selectedAllegatoState = signal<AttachmentResponseDTO | null>(null);
  public selectedAllegatoState = this._selectedAllegatoState.asReadonly();
  private _dipInfo = signal<DipContentResponseDTO | null>(null);
  public dipInfo = this._dipInfo.asReadonly();

  public async loadDocuments(): Promise<void> {
    this._isLoading.set(true);
    try {
      this._documentList.set(await this.electronIpc.loadDocuments());
    } catch (error) {
      console.error('Error loading documents:', error);
      this.errorMessage.set('Failed to load documents. Please try again.');
    } finally {
      this._isLoading.set(false);
    }
  }

  public async loadDipInfo(): Promise<void> {
    try {
      const dipInfo = await this.electronIpc.loadDipInfo();
      this._dipInfo.set(dipInfo);
    } catch (error) {
      console.error('Error loading dip info:', error);
      this.errorMessage.set('Failed to load dip info. Please try again.');
    }
  }

  public selectDocument(id: string): void {
    this._isLoading.set(true);
    this._selectedDocumentState.set(null);
    this._selectedAllegatoState.set(null);
    const document = this.documentList().find((doc: DocumentDetailsResponseDTO) => doc.uuid === id);
    if (document) {
      this._selectedDocumentState.set(document);
    }
    this._isLoading.set(false);
  }

  public selectAllegato(allegato: AttachmentResponseDTO): void {
    this._isLoading.set(true);
    this._selectedDocumentState.set(null);
    this._selectedAllegatoState.set(allegato);
    this._isLoading.set(false);
  }

  public async previewSelect(item: DocumentDetailsResponseDTO | AttachmentResponseDTO): Promise<void> {
    if ('name' in item) {
      this._previewSelectedDocumentState.set(item);
      this._previewItemFormato.set(item.extension?.toLowerCase() || 'pdf');
    } else {
      const doc = this.documentList().find((d) =>
        d.attachments.some((a) => a.uuid === item.uuid),
      );
      this._previewSelectedDocumentState.set(doc || null);
      this._previewItemFormato.set(item.extension?.toLowerCase() || 'pdf');
    }
    await this.loadDocumentFile(item);
  }

  public async searchDocuments(filters: FilterModel[]): Promise<void> {
    this.clearSelection();
    this._isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const filteredDocuments = await this.electronIpc.searchDocuments(filters);
      this._documentList.set(filteredDocuments);
    } catch (error) {
      console.error('Error searching documents:', error);
      this.errorMessage.set('Failed to search documents. Please try again.');
    } finally {
      this._isLoading.set(false);
    }
  }
  public clearSelection(): void {
    this._selectedDocumentState.set(null);
    this._selectedAllegatoState.set(null);
    this.clearPreview();
  }

  public async clearPreview(): Promise<void> {
    this._previewSelectedDocumentState.set(null);
    this._previewItemFormato.set(null);
    this._documentFileUrl.set(null);
  }

  public async autoImport(): Promise<void> {
    this._isLoading.set(true);
    this.errorMessage.set(null);
    try {
      await this.electronIpc.autoImport();
      await this.loadDocuments();
      await this.loadDipInfo();
    } catch (error) {
      console.error('Error auto importing:', error);
      this.errorMessage.set('Failed to auto import documents. Please try again.');
    } finally {
      this._isLoading.set(false);
    }
  }

  public async loadDocumentFile(item: DocumentDetailsResponseDTO | AttachmentResponseDTO): Promise<void> {
    if (this.documentFileUrl()) URL.revokeObjectURL(this.documentFileUrl()!);
    const filePath = 'path' in item ? item.path : null;

    if (!filePath) {
      this.errorMessage.set('No file found for this document.');
      this._documentFileUrl.set(null);
      return;
    }

    let mimeType = 'application/pdf';
    const form = item.extension?.toLowerCase() || 'pdf';
    if (form === 'png') mimeType = 'image/png';
    else if (form === 'jpg' || form === 'jpeg') mimeType = 'image/jpeg';
    else if (form === 'txt') mimeType = 'text/plain';

    this._isLoadingPreview.set(true);
    try {
      const bytes = await this.electronIpc.loadDocumentFile(filePath);
      const blobBytes = Uint8Array.from(bytes);
      this._documentFileUrl.set(URL.createObjectURL(new Blob([blobBytes], { type: mimeType })));
    } catch (error) {
      console.error('Error loading document file:', error);
      this.errorMessage.set('Failed to load document file. Please try again.');
    } finally {
      this._isLoadingPreview.set(false);
    }
  }
}
