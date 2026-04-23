import { IpcResponse } from '@shared/ipc-response';
import { DipRequestDTO } from '@shared/request/dip.request.dto';
import { DocumentRequestDTO } from '@shared/request/document.request.dto';
import { AutoImportDipResponseDTO } from '@shared/response/auto-import-dip.response.dto';
import { DipContentResponseDTO } from '@shared/response/dip-details.response.dto';
import { DocumentDetailsResponseDTO } from '@shared/response/document-details.response.dto';

declare global {
  interface Window {
    electronAPI: {
      dip: {
        autoImport(): Promise<IpcResponse<AutoImportDipResponseDTO>>;
        content?(dipRequestDto: DipRequestDTO): Promise<IpcResponse<DipContentResponseDTO>>;
        loadDocuments(): Promise<IpcResponse<DocumentDetailsResponseDTO[]>>;
        searchDocuments(filters: FilterModel[]): Promise<IpcResponse<DocumentDetailsResponseDTO[]>>;
        loadDocumentFile(filePath: string): Promise<IpcResponse<Uint8Array>>;
        loadDipInfo(): Promise<IpcResponse<DipContentResponseDTO>>;
      };
      document?: {
        details(
          documentRequestDto: DocumentRequestDTO,
        ): Promise<IpcResponse<DocumentDetailsResponseDTO>>;
      };
      on(channel: string, callback: (data: unknown) => void): () => void;
    };
  }
}
