import { Document } from '../domain/document.model';
import { MetadataFilter } from '../domain/metadata-filter.model';

export interface DocumentRepository {
  saveMany(documents: Document[]): Promise<Document[]>;
  findByUuid(documentUuid: string, withMetadata: boolean): Promise<Document | null>;
  findAllByDipUuid(dipUuid: string, withMetadata: boolean): Promise<Document[]>;
  findAllByMetadata(filters: MetadataFilter[], withMetadata: boolean): Promise<Document[]>;
}
