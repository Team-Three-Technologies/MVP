import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AttachmentResponseDTO,
  DocumentDetailsResponseDTO,
} from '@shared/response/document-details.response.dto';

@Component({
  selector: 'app-document-list',
  imports: [CommonModule],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
  standalone: true,
})
export class DocumentList {
  @Input() documents: DocumentDetailsResponseDTO[] = [];
  @Input() isLoading: boolean = false;
  @Input() errorMessage: string | null = null;

  @Output() documentSelected = new EventEmitter<string>();
  @Output() attachmentSelected = new EventEmitter<{
    doc: DocumentDetailsResponseDTO;
    allegato: AttachmentResponseDTO;
  }>();
  @Output() itemPreview = new EventEmitter<DocumentDetailsResponseDTO | AttachmentResponseDTO>();
  onRowClick(id: string): void {
    this.documentSelected.emit(id);
  }

  onAttachmentClick(doc: DocumentDetailsResponseDTO, allegato: AttachmentResponseDTO, event: Event) {
    event.stopPropagation();
    this.attachmentSelected.emit({ doc, allegato });
  }

  onViewClick(item: DocumentDetailsResponseDTO | AttachmentResponseDTO, event: Event) {
    event.stopPropagation();
    this.itemPreview.emit(item);
  }
}
