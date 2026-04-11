import { Component, Input} from '@angular/core';
import { DocumentModel } from '../../models/document';
import {NgxDocViewerModule} from 'ngx-doc-viewer';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [NgxDocViewerModule],
  templateUrl: './document-preview.html',
  styleUrls: ['./document-preview.css']
})
export class DocumentPreview {
  @Input() document: DocumentModel | null = null;
  @Input() documentFileUrl: string | null = null;
  @Input() isLoadingPreview: boolean = false;
  
}