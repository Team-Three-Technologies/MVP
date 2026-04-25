import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentEssentialsDTO, DocumentEssentialsAttachmentDTO } from '@shared/response/dip-content.response.dto';

@Component({
  selector: 'app-document-list',
  imports: [CommonModule],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
  standalone: true,
})
export class DocumentList {
  @Input() documents: DocumentEssentialsDTO[] = [];
  @Input() isLoading: boolean = false;
  @Input() errorMessage: string | null = null;
  @Input() integrityMap: Map<string, boolean> = new Map();

  @Output() documentSelected = new EventEmitter<string>();
  @Output() attachmentSelected = new EventEmitter<{ documentUuid: string; attachmentUuid: string }>();
  @Output() itemPreview = new EventEmitter<{ documentUuid: string; attachmentUuid?: string }>();

  getIntegrityStatus(uuid: string): 'ok' | 'ko' | 'unknown' {
    if (!this.integrityMap.has(uuid)) return 'unknown';
    return this.integrityMap.get(uuid) ? 'ok' : 'ko';
  }

  onRowClick(id: string): void {
    this.documentSelected.emit(id);
  }

  onAttachmentClick(
    doc: DocumentEssentialsDTO,
    allegato: DocumentEssentialsAttachmentDTO,
    event: Event,
  ) {
    event.stopPropagation();
    
    this.attachmentSelected.emit({
      documentUuid: doc.documentUuid,
      attachmentUuid: allegato.uuid
    });
  }

  onViewDocumentClick(doc: DocumentEssentialsDTO, event: Event) {
    event.stopPropagation();
    this.itemPreview.emit({
      documentUuid: doc.documentUuid,
    });
  }

  onViewAttachmentClick(doc: DocumentEssentialsDTO, allegato: DocumentEssentialsAttachmentDTO, event: Event) {
    event.stopPropagation();
    this.itemPreview.emit({
      documentUuid: doc.documentUuid,
      attachmentUuid: allegato.uuid,
    });
  }
}
