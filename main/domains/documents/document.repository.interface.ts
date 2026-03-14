import { Document } from './document.model';

export interface IDocumentRepository {
  findAll(): Document[];
  findById(id: string): Document | null;
  save(document: Document): Document;
  delete(id: string): void;
}