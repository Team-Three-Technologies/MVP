import { Injectable, inject } from '@angular/core';
import { DocumentModel, Allegato } from '../models/document';
import { signal } from '@angular/core';
import { ElectronIpc } from '../services/electron-ipc';
import { FilterModel } from '../models/filter';
import { DipInfoModel } from '../models/dip-info';
@Injectable({
  providedIn: 'root',
})
export class BackendFacade {
  private readonly electronIpc = inject(ElectronIpc);
  private _selectedDocumentState = signal<DocumentModel | null>(null);
  public selectedDocumentState = this._selectedDocumentState.asReadonly();
  public errorMessage = signal<string | null>(null);
  private _documentList = signal<DocumentModel[]>([]);
  public documentList = this._documentList.asReadonly();
  private _isLoading = signal<boolean>(false);
  public isLoading = this._isLoading.asReadonly();
  private _documentFileUrl = signal<string | null>(null);
  public documentFileUrl = this._documentFileUrl.asReadonly();
  private _isLoadingPreview = signal<boolean>(false);
  public isLoadingPreview = this._isLoadingPreview.asReadonly();
  private _previewSelectedDocumentState = signal<DocumentModel | null>(null);
  public previewSelectedDocumentState = this._previewSelectedDocumentState.asReadonly();
  private _previewItemFormato = signal<string | null>(null);
  public previewItemFormato = this._previewItemFormato.asReadonly();
  private _selectedAllegatoState = signal<Allegato | null>(null);
  public selectedAllegatoState = this._selectedAllegatoState.asReadonly();
  private _dipInfo = signal<DipInfoModel | null>(null);
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
    const document = this.documentList().find((doc: DocumentModel) => doc.uuid_documento === id);
    if (document) {
      this._selectedDocumentState.set(document);
    }
    this._isLoading.set(false);
  }

  public selectAllegato(allegato: Allegato): void {
    this._isLoading.set(true);
    this._selectedDocumentState.set(null);
    this._selectedAllegatoState.set(allegato);
    this._isLoading.set(false);
  }

  public async previewSelect(item: DocumentModel | Allegato): Promise<void> {
    if ('uuid_documento' in item) {
      this._previewSelectedDocumentState.set(item as DocumentModel);
      this._previewItemFormato.set(item.formato?.toLowerCase() || 'pdf');
    } else if ('id_allegato' in item) {
      const doc = this.documentList().find((d) =>
        d.allegati.some((a) => a.id_allegato === item.id_allegato),
      );
      this._previewSelectedDocumentState.set(doc || null);
      this._previewItemFormato.set(item.formato?.toLowerCase() || 'pdf');
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

  public async loadDocumentFile(item: DocumentModel | Allegato): Promise<void> {
    if (this.documentFileUrl()) URL.revokeObjectURL(this.documentFileUrl()!);
    const filePercorso = item.percorso;

    if (!filePercorso) {
      this.errorMessage.set('No file found for this document.');
      this._documentFileUrl.set(null);
      return;
    }

    let mimeType = 'application/pdf';
    const form = item.formato?.toLowerCase() || 'pdf';
    if (form === 'png') mimeType = 'image/png';
    else if (form === 'jpg' || form === 'jpeg') mimeType = 'image/jpeg';
    else if (form === 'txt') mimeType = 'text/plain';

    this._isLoadingPreview.set(true);
    try {
      const bytes = await this.electronIpc.loadDocumentFile(filePercorso);
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
