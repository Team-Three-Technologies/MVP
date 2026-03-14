import type { DocumentDto, CreateDocumentDto } from '../../shared/dto';

export interface DocumentUseCase {
  findAll(): DocumentDto[];
  save(dto: CreateDocumentDto): DocumentDto;
  delete(id: string): void;
}