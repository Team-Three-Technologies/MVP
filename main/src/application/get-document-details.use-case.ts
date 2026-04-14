import { Document } from '../domain/document.model';

export interface GetDocumentDetailsUseCase {
  execute(documentUuid: string): Promise<Document>;
}