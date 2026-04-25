import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentDetailsResponseDTO } from '@shared/response/document-details.response.dto';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [],
  templateUrl: './document-preview.html',
  styleUrl: './document-preview.css',
})
export class DocumentPreview implements OnChanges {
  @Input() document: { name: string } | null = null;
  @Input() itemFormato: string | null = null;
  @Input() documentFileUrl: string | null = null;
  @Input() isLoadingPreview: boolean = false;

  private sanitizer = inject(DomSanitizer);
  public safeDocumentUrl: SafeResourceUrl | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentFileUrl'] && this.documentFileUrl) {
        this.safeDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.documentFileUrl);
      } else {
        this.safeDocumentUrl = null;
      }
    }
  }
