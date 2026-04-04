import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentModel } from '../../models/models/document';

@Component({
  selector: 'app-document-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-details.html',
  styleUrls: ['./document-details.css']
})
export class DocumentDetails {
  @Input() document: DocumentModel | null = null;
}