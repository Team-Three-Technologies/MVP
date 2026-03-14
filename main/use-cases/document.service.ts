import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import type { DocumentUseCase } from './document.use-case';
import type { IDocumentRepository } from '../repositories/document.interface.repository';
import type { DocumentDto, CreateDocumentDto } from '../../shared/dto';
import { DocumentMapper } from '../mappers/document.mapper';

@injectable()
export class DocumentService implements DocumentUseCase {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly repo: IDocumentRepository
  ) { }

  findAll(): DocumentDto[] {
    return this.repo.findAll().map(DocumentMapper.toDto);
  }

  save(dto: CreateDocumentDto): DocumentDto {
    if (!dto.title?.trim()) throw new Error('Il titolo è obbligatorio');
    const document = DocumentMapper.toDomain(dto);
    return DocumentMapper.toDto(this.repo.save(document));
  }

  delete(id: string): void {
    if (!id) throw new Error('Id obbligatorio');
    this.repo.delete(id);
  }
}