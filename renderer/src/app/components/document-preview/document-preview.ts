import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [],
  templateUrl: './document-preview.html',
  styleUrl: './document-preview.css',
})
export class DocumentPreview implements OnChanges {
  @Input() document: any | null = null;
  @Input() itemFormato: string | null = null;
  @Input() documentFileUrl: string | null = null;
  @Input() isLoadingPreview: boolean = false;

  private sanitizer = inject(DomSanitizer);
  public safeDocumentUrl: SafeResourceUrl | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentFileUrl']) {
      this.safeDocumentUrl = this.documentFileUrl
        ? this.sanitizer.bypassSecurityTrustResourceUrl(this.documentFileUrl)
        : null;
    }
  }
}
