import { Injectable } from '@angular/core';
import { DocumentModel } from '../models/document.model';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BackendFacade {
  selectedDocumentState= signal<DocumentModel | null>(null);
  errorMessage= signal<string | null>(null);
  documentList= signal<DocumentModel[]>([]);
  isLoading= signal<boolean>(false);

  public async loadDocuments(): Promise<void> {
    this.isLoading.set(true);
    //develop this method to load documents from the backend and update the documentList signal
  }

  public async selectDocument(id: string): Promise<void> {
    this.isLoading.set(true);
    this.selectedDocumentState.set(null);
    const document = this.documentList().find((doc) => doc.id === id);
    if (document) {
      this.selectedDocumentState.set(document);
    }
  }
  public async searchDocuments(filter: string): Promise<void> {
    this.clearSelection();
    //develop this method to filter documents based on the provided filter string
  }
  public async clearSelection(): Promise<void> {
    this.selectedDocumentState.set(null);
  }
}




