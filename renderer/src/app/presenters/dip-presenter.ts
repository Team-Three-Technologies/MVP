import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DocumentModel } from '../models/document';
import { BackendFacade } from '../facades/backend.facade';
import { FilterModel } from '../models/filter';

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

  async searchDocuments(filters: FilterModel[]): Promise<void> {
    this.isLoadingSubject.next(true);
    this.errorMessageSubject.next(null);

    try {
      await this.facade.searchDocuments(filters);
      this.documentsSubject.next(this.facade.documentList());
    } catch (err) {
      this.errorMessageSubject.next((err as Error).message ?? 'Error during search');
    } finally {
      this.isLoadingSubject.next(false);
    }
  }

  async selectDocument(id: string): Promise<void> {
    await this.facade.selectDocument(id);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
