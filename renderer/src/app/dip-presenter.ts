import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DocumentModel } from './models/models/document';
import { BackendFacade } from './components/facades/backend.facade';

//creare filter.model.ts che contiene solo l'interfaccia?
export interface Filter {
  type: string;
  value: string;
}

@Injectable()
export class DipPresenter implements OnDestroy {

  private documentsSubject = new BehaviorSubject<DocumentModel[]>([]);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private errorMessageSubject = new BehaviorSubject<string | null>(null);

  documents$ = this.documentsSubject.asObservable();
  isLoading$ = this.isLoadingSubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();

  protected destroy$ = new Subject<void>();

  constructor(private facade: BackendFacade) {}

  async searchDocuments(filters: Filter[]): Promise<void> {
    this.isLoadingSubject.next(true);
    this.errorMessageSubject.next(null);

    try {
      await this.facade.loadDocuments();
      this.documentsSubject.next(this.facade.documentList());
    } catch (err) {
      this.errorMessageSubject.next((err as Error).message ?? 'Error during search');
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  selectDocument(id: string): void {
    console.warn('Documento selezionato nel Presenter:', id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
// facade con selectDocument e searchDocument?
// aggigunere in DipPresenter:
// documents$: Observable<DocumentModel[]>
// isLoading$: Observable<boolean> 
// errorMessage$: Observable<string | null>
// searchDocuments(filters: Filter[]): void

