import { Injectable } from '@angular/core';
import { DocumentDetailsResponseDTO } from '@shared/response/document-details.response.dto';
import { FilterModel } from '../models/filter';
import { DipInfoModel } from '../models/dip-info';

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

  public async loadDipInfo(): Promise<DipInfoModel> {
    try {
      const dipInfo = await this.api.dip.loadDipInfo();
      return dipInfo as DipInfoModel;
    } catch (error) {
      console.error('Error loading DIP info:', error);
      throw error;
    }
  }

  public async loadDocuments(): Promise<DocumentDetailsResponseDTO[]> {
    try {
      const documents = await this.api.dip.loadDocuments();
      return documents as DocumentDetailsResponseDTO[];
    } catch (error) {
      console.error('Error loading documents:', error);
      throw error;
    }
  }

  public async searchDocuments(filters: FilterModel[]): Promise<DocumentDetailsResponseDTO[]> {
    try {
      const filteredDocuments = await this.api.dip.searchDocuments(filters);
      return filteredDocuments as DocumentDetailsResponseDTO[];
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
