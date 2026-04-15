import { DocumentModel } from '../models/document';
import { FilterModel } from '../models/filter';
import { DipInfoModel } from '../models/dip-info';

declare global {
  interface Window {
    electronAPI: {
      dip: {
        autoImport(): Promise<void>;
        loadDocuments(): Promise<DocumentModel[]>;
        searchDocuments(filters: FilterModel[]): Promise<DocumentModel[]>;
        loadDocumentFile(filePath: string): Promise<number[]>;
        loadDipInfo(): Promise<DipInfoModel>;
      };
      on(channel: string, callback: (data: unknown) => void): () => void;
    };
  }
}
