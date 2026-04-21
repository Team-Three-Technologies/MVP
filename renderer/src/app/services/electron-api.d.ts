import { DocumentDetailsResponseDTO } from '@shared/response/document-details.response.dto';
import { FilterModel } from '../models/filter';
import { DipInfoModel } from '../models/dip-info';

declare global {
  interface Window {
    electronAPI: {
      dip: {
        autoImport(): Promise<void>;
        loadDocuments(): Promise<DocumentDetailsResponseDTO[]>;
        searchDocuments(filters: FilterModel[]): Promise<DocumentDetailsResponseDTO[]>;
        loadDocumentFile(filePath: string): Promise<number[]>;
        loadDipInfo(): Promise<DipInfoModel>;
      };
      on(channel: string, callback: (data: unknown) => void): () => void;
    };
  }
}
