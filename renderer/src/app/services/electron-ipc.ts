import { Injectable } from '@angular/core';
import { IpcResponse } from '@shared/ipc-response';
import { DipRequestDTO } from '@shared/request/dip.request.dto';
import { DocumentRequestDTO } from '@shared/request/document.request.dto';
import { SearchRequestDTO } from '@shared/request/search.request.dto';
import { FileRequestDTO } from '@shared/request/file.request.dto';
import { AutoImportDipResponseDTO } from '@shared/response/auto-import-dip.response.dto';
import { DipContentResponseDTO } from '@shared/response/dip-content.response.dto';
import { DocumentDetailsResponseDTO } from '@shared/response/document-details.response.dto';
import { DipIntegrityResponseDTO } from '@shared/response/dip-integrity.response.dto';
import { SearchResponseDTO } from '@shared/response/search.response.dto';
import { FileInternalPreviewResponseDTO } from '@shared/response/file-internal-preview.response.dto';
import { ExportFileResponseDTO } from '@shared/response/export-file.response';

@Injectable({
  providedIn: 'root',
})
export class ElectronIpc {
  private api = window.electronAPI;

  private unwrapIpcResponse<T>(response: IpcResponse<T>, fallbackMessage: string): T {
    if (response.error) {
      throw new Error(response.error);
    }

    if (response.data === null || response.data === undefined) {
      throw new Error(fallbackMessage);
    }

    return response.data;
  }

  public async autoImport(): Promise<AutoImportDipResponseDTO> {
    try {
      const response = await this.api.dip.autoImport();
      return this.unwrapIpcResponse(response, 'Invalid response during auto import');
    } catch (error) {
      console.error('Error during auto import:', error);
      throw error;
    }
  }

  public async content(dipRequestDto: DipRequestDTO): Promise<DipContentResponseDTO> {
    try {
      const response = await this.api.dip.content(dipRequestDto);
      return this.unwrapIpcResponse(response, 'Invalid response while loading DIP info');
    } catch (error) {
      console.error('Error loading DIP info:', error);
      throw error;
    }
  }

  public async checkIntegrity(dipRequestDto: DipRequestDTO): Promise<DipIntegrityResponseDTO> {
    try {
      const response = await this.api.dip.checkIntegrity(dipRequestDto);
      return this.unwrapIpcResponse(response, 'Invalid response while checking DIP integrity');
    } catch (error) {
      console.error('Error checking DIP integrity:', error);
      throw error;
    }
  }

  public async getDocumentDetails(
    documentRequestDto: DocumentRequestDTO,
  ): Promise<DocumentDetailsResponseDTO> {
    try {
      const response = await this.api.document.details(documentRequestDto);
      return this.unwrapIpcResponse(response, 'Invalid response while loading document details');
    } catch (error) {
      console.error('Error loading document details:', error);
      throw error;
    }
  }

  public async searchDocuments(searchRequestDto: SearchRequestDTO): Promise<SearchResponseDTO> {
    try {
      const response = await this.api.document.searchDocuments(searchRequestDto);
      return this.unwrapIpcResponse(response, 'Invalid response while searching documents');
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }

  public async fileInternalPreview(
    fileRequestDto: FileRequestDTO,
  ): Promise<FileInternalPreviewResponseDTO> {
    try {
      const response = await this.api.document.fileInternalPreview(fileRequestDto);
      return this.unwrapIpcResponse(response, 'Invalid response while loading document file');
    } catch (error) {
      console.error('Error loading document file:', error);
      throw error;
    }
  }

  public async fileExternalPreview(fileRequestDto: FileRequestDTO): Promise<void> {
    try {
      const response = await this.api.document.fileExternalPreview(fileRequestDto);
      if (response.error) {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error opening external preview:', error);
      throw error;
    }
  }

  public async exportFile(fileRequestDto: FileRequestDTO): Promise<ExportFileResponseDTO> {
    try {
      const response = await this.api.document.exportFile(fileRequestDto);
      return this.unwrapIpcResponse(response, 'Invalid response while exporting file');
    } catch (error) {
      console.error('Error exporting file:', error);
      throw error;
    }
  }
}
