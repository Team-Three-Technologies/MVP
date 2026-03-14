import { Document } from '../models/document.model';
import { CreateDocumentDto, DocumentDto } from '../../shared/dto';

export class DocumentMapper {
  static toDto(domain: Document): DocumentDto {
    return {
      id: domain.id,
      title: domain.title,
      content: domain.content,
      updatedAt: domain.updatedAt.toISOString(),
    };
  }

  static toDomain(dto: CreateDocumentDto): Document {
    return {
      id: crypto.randomUUID(),
      title: dto.title,
      content: dto.content,
      updatedAt: new Date(),
    };
  }
}