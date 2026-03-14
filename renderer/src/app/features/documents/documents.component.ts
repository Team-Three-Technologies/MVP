import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from './document.service';
import type { DocumentDto } from '@shared/dto';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit {
  documents: DocumentDto[] = [];
  newTitle = '';
  newContent = '';
  error = '';

  constructor(
    private readonly documentService: DocumentService,
    private readonly cdr: ChangeDetectorRef
  ) { }

  async ngOnInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    try {
      this.documents = await this.documentService.list();
      this.error = '';
    } catch (e) {
      this.error = (e as Error).message;
    } finally {
      this.cdr.detectChanges();
    }
  }

  async create(): Promise<void> {
    try {
      await this.documentService.save({
        title: this.newTitle.trim(),
        content: this.newContent.trim(),
      });
      this.newTitle = '';
      this.newContent = '';
      await this.load();
    } catch (e) {
      this.error = (e as Error).message;
      this.cdr.detectChanges();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.documentService.delete(id);
      await this.load();
    } catch (e) {
      this.error = (e as Error).message;
      this.cdr.detectChanges();
    }
  }
}