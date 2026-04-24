import { Document } from '../domain/document.model';
import { File } from '../domain/file.model';
import { Metadata } from '../domain/metadata.model';
import { MetadataFilter } from '../domain/metadata-filter.model';

export interface DocumentRepository {
  save(document: Document): Promise<Document>;
  findMainFileByDocumentUuid(documentUuid: string): Promise<File>;
  findAttachmentsByDocumentUuid(documentUuid: string): Promise<File[]>;
  findMetadataByDocumentUuid(documentUuid: string): Promise<Metadata[]>;
  findByUuid(documentUuid: string): Promise<Document | null>;
  findAllByDipUuid(dipUuid: string): Promise<Document[]>;
  findAllByDocumentClassUuid(documentClassUuid: string): Promise<Document[]>;
  findAllByConservationProcessUuid(conservationProcessUuid: string): Promise<Document[]>;
  findFileByUuid(fileUuid: string): Promise<File | null>;
  findAllByMetadata(filters: MetadataFilter[]): Promise<Document[]>;
}
