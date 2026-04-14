import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentModel, Allegato } from '../../models/document';

@Component({
  selector: 'app-document-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-details.html',
  styleUrls: ['./document-details.css']
})
export class DocumentDetails {
  @Input() document: DocumentModel | null = null;
  @Input() allegato: Allegato | null = null;
  @Input() isLoading: boolean = false;
}