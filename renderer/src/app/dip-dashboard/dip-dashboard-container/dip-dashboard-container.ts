import { Component, inject } from '@angular/core';
import { BackendFacade } from 'src/app/components/facades/backend.facade';

@Component({
  selector: 'app-dip-dashboard-container',
  imports: [],
  templateUrl: './dip-dashboard-container.html',
  styleUrl: './dip-dashboard-container.css',
})

export class DipDashboardContainer {
  private facade=inject(BackendFacade);
  public async onDocumentSelected(id: string): Promise<void> {
    await this.facade.selectDocument(id);
  }

  public async ngOnInit(): Promise<void> {
    await this.facade.loadDocuments();
  }
   public async onSearch(filter: string): Promise<void> {
    await this.facade.searchDocuments(filter);
  }

  public async ngOnDestroy(): Promise<void> {
    await this.facade.clearSelection();
  }
}
