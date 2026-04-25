import { DocumentClass } from '../domain/document-class.model';

export interface DocumentClassRepository {
  save(documentClass: DocumentClass): Promise<DocumentClass>;
}
