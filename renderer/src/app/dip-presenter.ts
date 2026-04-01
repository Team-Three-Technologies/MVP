import { Directive } from '@angular/core';
import { DocumentModel } from '../../domain/models/document.model';

@Directive
export abstract class DipPresenter {
  @Input() documents: DocumentModel[] = [];
  @Output() documentSelected = new EventEmitter<string>();

  protected emitSelection(id: string): void {
    if(id) {
      this.documentSelected.emit(id);
    }
  }

}
