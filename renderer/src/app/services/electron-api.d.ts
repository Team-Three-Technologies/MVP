import { IpcResponse } from '@shared/ipc-response';
import { DipRequestDTO } from '@shared/request/dip.request.dto';
import { DocumentRequestDTO } from '@shared/request/document.request.dto';
import { AutoImportDipResponseDTO } from '@shared/response/auto-import-dip.response.dto';
import { DipContentResponseDTO } from '@shared/response/dip-content.response.dto';
import { DocumentDetailsResponseDTO } from '@shared/response/document-details.response.dto';
import { SearchRequestDTO } from '@shared/request/search.request.dto';
import { DipIntegrityResponseDTO } from '@shared/response/dip-integrity.response.dto';
import { SearchResponseDTO } from '@shared/response/search.response.dto';
import { FileInternalPreviewResponseDTO } from '@shared/response/file-internal-preview.response.dto';
import { ExportFileResponseDTO } from '@shared/response/export-file.response';
import { FileRequestDTO } from '@shared/request/file.request.dto';

declare global {
  interface Window {
    electronAPI: {
      toLocalFileUrl: (filePath: string) => string;
      dip: {
        autoImport(): Promise<IpcResponse<AutoImportDipResponseDTO>>;
        content(dipRequestDto: DipRequestDTO): Promise<IpcResponse<DipContentResponseDTO>>;
        checkIntegrity(dipRequestDto: DipRequestDTO): Promise<IpcResponse<DipIntegrityResponseDTO>>;
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
