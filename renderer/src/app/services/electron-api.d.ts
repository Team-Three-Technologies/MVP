import { IpcResponse } from '@shared/ipc-response';
import { DipRequestDTO } from '@shared/request/dip.request.dto';
import { DocumentRequestDTO } from '@shared/request/document.request.dto';
import { AutoImportDipResponseDTO } from '@shared/response/auto-import-dip.response.dto';
import { DipContentResponseDTO } from '@shared/response/dip-details.response.dto';
import { DocumentDetailsResponseDTO } from '@shared/response/document-details.response.dto';
import { SearchRequestDTO } from '@shared/request/search.request.dto';

declare global {
  interface Window {
    electronAPI: {
      dip: {
        autoImport(): Promise<IpcResponse<AutoImportDipResponseDTO>>;
        content(dipRequestDto: DipRequestDTO): Promise<IpcResponse<DipContentResponseDTO>>;
        checkIntegrity(dipRequestDto: DipRequestDTO): Promise<IpcResponse<DipIntegrityResponseDTO>>;
        // sotto qua da togliere
        loadDocuments(): Promise<IpcResponse<DocumentDetailsResponseDTO[]>>;
        loadDocumentFile(filePath: string): Promise<IpcResponse<Uint8Array>>;
        loadDipInfo(): Promise<IpcResponse<DipContentResponseDTO>>;
      };
      document: {
        details(
          documentRequestDto: DocumentRequestDTO,
        ): Promise<IpcResponse<DocumentDetailsResponseDTO>>;
        searchDocuments(
          searchRequestDto: SearchRequestDTO,
        ): Promise<IpcResponse<SearchResponseDTO>>;
        fileInternalPreview(
          fileRequestDto: FileRequestDTO,
        ): Promise<IpcResponse<FileInternalPreviewResponseDTO>>;
        fileExternalPreview(fileRequestDto: FileRequestDTO): Promise<IpcResponse<void>>;
        exportFile(fileRequestDto: FileRequestDTO): Promise<IpcResponse<ExportFileResponseDTO>>;
      };
      on(channel: string, callback: (data: unknown) => void): () => void;
    };
  }
}
