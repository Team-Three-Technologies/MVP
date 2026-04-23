import { Document } from '../domain/document.model';
import {SearchFilterDTO} from '../../../shared/request/search-filter.request.dto'

export interface DocumentRepository {
  save(document: Document): Promise<Document>;
  findByUuid(documentUuid: string): Promise<Document | null>;
  findAllByDipUuid(dipUuid: string): Promise<Document[]>;
  findAllByDocumentClassUuid(documentClassUuid: string): Promise<Document[]>;
  findAllByConservationProcessUuid(conservationProcessUuid: string): Promise<Document[]>;
    findAllByMetadata(filters:SearchFilterDTO[]): Promise<Document[]>
}
