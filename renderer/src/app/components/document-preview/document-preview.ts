import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentModel } from '../../models/document';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document-preview.html',
  styleUrls: ['./document-preview.css']
})
export class DocumentPreview implements OnChanges {
  @Input() document: DocumentModel | null = null;
  @Input() pdfBase64: string | null = null;
  @Input() isLoadingPreview: boolean = false;

  safeUrl: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.pdfBase64) {
      const dataUri = `data:application/pdf;base64,${this.pdfBase64}`;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(dataUri);
    } else {
      this.safeUrl = null;
    }
  }
}