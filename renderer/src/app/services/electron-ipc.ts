import { Injectable } from '@angular/core';
import { IpcResponse } from '@shared/ipc-response';
import { DocumentDetailsResponseDTO } from '@shared/response/document-details.response.dto';
import { DipContentResponseDTO } from '@shared/response/dip-content.response.dto';

@Injectable({
  providedIn: 'root',
})
export class ElectronIpc {
  private api = window.electronAPI;

  private unwrapIpcResponse<T>(response: IpcResponse<T>, fallbackMessage: string): T {
    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data === null) {
      throw new Error(fallbackMessage);
    }

    return response.data;
  }

  public async autoImport(): Promise<void> {
    try {
      const response = await this.api.dip.autoImport();
      this.unwrapIpcResponse(response, 'Invalid response during auto import');
    } catch (error) {
      console.error('Error during auto import:', error);
      throw error;
    }
  }

  public async loadDipInfo(): Promise<DipContentResponseDTO> {
    try {
      const response = await this.api.dip.loadDipInfo();
      return this.unwrapIpcResponse(response, 'Invalid response while loading DIP info');
    } catch (error) {
      console.error('Error loading DIP info:', error);
      throw error;
    }
  }

  public async loadDocuments(): Promise<DocumentDetailsResponseDTO[]> {
    try {
      const response = await this.api.dip.loadDocuments();
      return this.unwrapIpcResponse(response, 'Invalid response while loading documents');
    } catch (error) {
      console.error('Error loading documents:', error);
      throw error;
    }
  }

  // public async searchDocuments(filters: FilterModel[]): Promise<DocumentDetailsResponseDTO[]> {
  //   try {
  //     const response = await this.api.dip.searchDocuments(filters);
  //     return this.unwrapIpcResponse(response, 'Invalid response while searching documents');
  //   } catch (error) {
  //     console.error('Error searching documents:', error);
  //     throw error;
  //   }
  // }

  public async loadDocumentFile(filePath: string): Promise<Uint8Array> {
    try {
      const response = await this.api.dip.loadDocumentFile(filePath);
      const file = this.unwrapIpcResponse(response, 'Invalid response while loading document file');
      return new Uint8Array(file);
    } catch (error) {
      console.error('Error loading document file:', error);
      throw error;
    }
  }
}
