import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentModel } from '../../models/document';
import {NgxDocViewerModule} from 'ngx-doc-viewer';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [NgxDocViewerModule],
  templateUrl: './document-preview.html',
  styleUrls: ['./document-preview.css']
})
export class DocumentPreview implements OnChanges {
  @Input() document: DocumentModel | null = null;
  @Input() itemFormato: string | null = null;
  @Input() documentFileUrl: string | null = null;
  @Input() isLoadingPreview: boolean = false;

  private sanitizer = inject(DomSanitizer);
  public safeDocumentUrl: SafeResourceUrl | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['documentFileUrl']) {
      if (this.documentFileUrl) {
        this.safeDocumentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.documentFileUrl);
      } else {
        this.safeDocumentUrl = null;
      }
    }
  }
}