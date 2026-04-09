import { Document } from '../domain/document.model';

export interface DocumentRepository {
  save(document: Document): Promise<Document>;
  findAllByDipUuid(dipUuid: string): Promise<Document[]>;
  findAllByDocumentClassUuid(documentClassUuid: string): Promise<Document[]>;
  findAllByConservationProcessUuid(conservationProcessUuid: string): Promise<Document[]>;
}