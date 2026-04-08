import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentModel } from '../../models/document';
import { Allegato } from '../../models/document';

@Component({
  selector: 'app-document-list',
  imports: [CommonModule],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
  standalone: true
})
export class DocumentList {
  @Input() documents: DocumentModel[] = [];
  @Input() isLoading: boolean = false;
  @Input() errorMessage: string | null = null;

  @Output() documentSelected = new EventEmitter<string>();
  @Output() attachmentSelected = new EventEmitter<{doc: DocumentModel, allegato: Allegato}>();

  onRowClick(id: string): void {
    this.documentSelected.emit(id);
  }

  onAttachmentClick(doc: DocumentModel, allegato: Allegato, event: Event) {
    event.stopPropagation();
    this.attachmentSelected.emit({ doc, allegato });
  }
}