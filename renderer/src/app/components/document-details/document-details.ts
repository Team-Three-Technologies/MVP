import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AttachmentResponseDTO,
  DocumentDetailsResponseDTO,
} from '@shared/response/document-details.response.dto';

@Component({
  selector: 'app-document-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-details.html',
  styleUrl: './document-details.css',
})
export class DocumentDetails {
  @Input() document: DocumentDetailsResponseDTO | null = null;
  @Input() allegato: AttachmentResponseDTO | null = null;
  @Input() isLoading: boolean = false;
}
