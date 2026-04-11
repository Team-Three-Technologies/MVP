import { Injectable } from '@angular/core';
import { DocumentModel } from '../models/document';
import { FilterModel } from '../models/filter';

@Injectable({
  providedIn: 'root',
})
export class ElectronIpc {
  private api = window.electronAPI;

  public async autoImport(): Promise<void> {
    try {
      await this.api.dip.autoImport();
    } catch (error) {
      console.error('Error during auto import:', error);
      throw error;
    }
  }

  public async loadDocuments(): Promise<DocumentModel[]> {
    try {
      const documents = await this.api.dip.loadDocuments();
      return documents as DocumentModel[];
    } catch (error) {
      console.error('Error loading documents:', error);
      throw error;
    }
  }

  public async searchDocuments(filters: FilterModel[]): Promise<DocumentModel[]> {
    try {
      const filteredDocuments = await this.api.dip.searchDocuments(filters);
      return filteredDocuments as DocumentModel[];
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }

  public async loadDocumentFile(filePath: string): Promise<Uint8Array> {
    try {
      const file = await this.api.dip.loadDocumentFile(filePath);
      return new Uint8Array(file);
    } catch (error) {
      console.error('Error loading document file:', error);
      throw error;
    }
  }

}
