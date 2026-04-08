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

  selectedDocumentState = signal<DocumentModel | null>(null);
  errorMessage = signal<string | null>(null);
  private _documentList = signal<DocumentModel[]>([]);
  public documentList = this._documentList.asReadonly();
  private _isLoading = signal<boolean>(false);
  public isLoading = this._isLoading.asReadonly();

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
    this.selectedDocumentState.set(null);
    const document = this.documentList().find((doc: DocumentModel) => doc.uuid_documento === id);
    if (document) {
      this.selectedDocumentState.set(document);
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
    this.selectedDocumentState.set(null);
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
}
