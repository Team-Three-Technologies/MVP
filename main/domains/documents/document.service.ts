import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../../infrastructure/tokens';
import type { IDocumentRepository } from './document.repository.interface';
import type { DocumentDto, CreateDocumentDto } from '../../../shared/dto';
import { DocumentMapper } from './document.mapper';
import { Document } from './document.model';

@injectable()
export class DocumentService {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly repo: IDocumentRepository
  ) { }

  findAll(): DocumentDto[] {
    return this.repo.findAll().map(DocumentMapper.toDto);
  }

  save(dto: CreateDocumentDto): DocumentDto {
    if (!dto.title?.trim()) throw new Error('Il titolo è obbligatorio');
    const domain: Document = {
      id: crypto.randomUUID(),
      title: dto.title,
      content: dto.content,
      updatedAt: new Date(),
    };
    return DocumentMapper.toDto(this.repo.save(domain));
  }

  delete(id: string): void {
    if (!id) throw new Error('Id obbligatorio');
    this.repo.delete(id);
  }
}