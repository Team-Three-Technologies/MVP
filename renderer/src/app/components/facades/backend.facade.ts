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
    this.documentList.set([]);
}


