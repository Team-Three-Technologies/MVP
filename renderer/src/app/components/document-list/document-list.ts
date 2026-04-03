import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentModel } from '../../models/models/document';

@Component({
  selector: 'app-document-list',
  imports: [CommonModule],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
  standalone: true
})
export class DocumentList {
  @Input() documents: DocumentModel[] = [];
  @Input() isLoading: boolean = false;
  @Input() errorMessage: string | null = null;

  @Output() documentSelected = new EventEmitter<string>();

  onRowClick(id: string): void {
    this.documentSelected.emit(id);
  }
}