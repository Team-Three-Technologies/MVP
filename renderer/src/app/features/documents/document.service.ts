import { Injectable } from '@angular/core';
import type { DocumentDto, CreateDocumentDto } from '@shared/dto';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private api = (window as any).electronAPI;

  async list(): Promise<DocumentDto[]> {
    const res = await this.api.documents.list();
    if (res.error) throw new Error(res.error);
    return res.data;
  }

  async save(dto: CreateDocumentDto): Promise<DocumentDto> {
    const res = await this.api.documents.save(dto);
    if (res.error) throw new Error(res.error);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    const res = await this.api.documents.delete(id);
    if (res.error) throw new Error(res.error);
  }
}