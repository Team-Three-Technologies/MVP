import { Injectable } from '@angular/core';
import { DocumentModel } from '../models/models/document';
import { Filter } from '../dip-presenter';

@Injectable({
  providedIn: 'root',
})
export class ElectronIpc {
  private api = (window as any).electronAPI;

  //develop this service to handle IPC communication with the Electron main process
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

  public async searchDocuments(filters: Filter[]): Promise<DocumentModel[]> {
    try {
      const filteredDocuments = await this.api.dip.searchDocuments(filters);
      return filteredDocuments as DocumentModel[];
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }

}
