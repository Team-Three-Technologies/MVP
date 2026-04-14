import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { GetDocumentDetailsUseCase } from './get-document-details.use-case';
import { Document } from '../domain/document.model';
import { DocumentRepository } from '../repositories/document.repository.interface';

@injectable()
export class GetDocumentDetailsService implements GetDocumentDetailsUseCase {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository
  ) { }

  public async execute(documentUuid: string): Promise<Document> {
    const document = await this.documentRepository.findByUuid('1cf35d1e-1b50-46c6-b6b2-f323435bf2ab');
    console.log(document);
    return document;
  }
}