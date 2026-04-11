import { Injectable, inject } from '@angular/core';
import { DocumentModel } from '../models/document';
import { signal } from '@angular/core';
import { ElectronIpc } from '../services/electron-ipc';
import { FilterModel } from '../models/filter';

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

  public async selectDocument(id: string): Promise<void> {
    this._isLoading.set(true);
    this._selectedDocumentState.set(null);
    const document = this.documentList().find((doc: DocumentModel) => doc.uuid_documento === id);
    if (document) {
      this._selectedDocumentState.set(document);
    }
    this._isLoading.set(false);
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
  public async clearSelection(): Promise<void> {
    this._selectedDocumentState.set(null);
  }

  public async autoImport(): Promise<void> {
    this._isLoading.set(true);
    this.errorMessage.set(null);
    try {
      await this.electronIpc.autoImport();
      await this.loadDocuments();
    } catch (error) {
      console.error('Error auto importing:', error);
      this.errorMessage.set('Failed to auto import documents. Please try again.');
    } finally {
      this._isLoading.set(false);
    }
  }

  public async loadDocumentFile(doc: DocumentModel): Promise<void> {
    if (this.documentFileUrl()) URL.revokeObjectURL(this.documentFileUrl()!);
    const file = doc.allegati[0];
    if (!file) {
      this.errorMessage.set('No file found for this document.');
      this._isLoadingPreview.set(false);
      this._documentFileUrl.set(null);
      return;
    }
    this._isLoadingPreview.set(true);
    try {
      const bytes = await this.electronIpc.loadDocumentFile(file.percorso);
      this._documentFileUrl.set(URL.createObjectURL(new Blob([bytes as any], { type: 'application/pdf' })));
    } catch (error) {
      console.error('Error loading document file:', error);
      this.errorMessage.set('Failed to load document file. Please try again.');
    } finally {
      this._isLoadingPreview.set(false);
    }
  }
}
