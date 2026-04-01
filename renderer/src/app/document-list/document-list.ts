import { Component } from '@angular/core';
import { DipPresenter } from '../dip-presenter';

@Component({
  selector: 'app-document-list',
  imports: [],
  templateUrl: './document-list.html',
  styleUrl: './document-list.css',
  standalone: true
})
export class DocumentListComponent extends DipPresenter {
  @Input() documents: DocumentModel[] = [];

  @Output() documentSelected = new EventEmitter<string>();

  public onRowClick(id: string): void {

      this.documentSelected.emit(id);
    }
}
