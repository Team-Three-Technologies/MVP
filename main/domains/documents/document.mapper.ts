import { Document } from './document.model';
import { DocumentDto } from '../../../shared/dto';

export class DocumentMapper {
  static toDto(domain: Document): DocumentDto {
    return {
      id: domain.id,
      title: domain.title,
      content: domain.content,
      updatedAt: domain.updatedAt.toISOString(),
    };
  }

  static toDomain(dto: DocumentDto): Document {
    return {
      id: dto.id,
      title: dto.title,
      content: dto.content,
      updatedAt: new Date(dto.updatedAt),
    };
  }
}