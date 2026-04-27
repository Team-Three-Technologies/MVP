import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DipDashboardContainer } from './dip-dashboard-container';
import { ElectronIpc } from '../services/electron-ipc';
import { IPC_CHANNELS } from '@shared/ipc-channels';

describe('DipDashboardContainer', () => {
  let component: DipDashboardContainer;
  let fixture: ComponentFixture<DipDashboardContainer>;
  let electronIpcMock: any;

  beforeEach(async () => {
    electronIpcMock = {
      getDocumentDetails: vi.fn(),
      searchDocuments: vi.fn(),
      exportFile: vi.fn(),
      checkIntegrity: vi.fn(),
      fileInternalPreview: vi.fn(),
      fileExternalPreview: vi.fn(),
      on: vi.fn().mockReturnValue(() => {}),
      autoImport: vi.fn().mockResolvedValue({ dipUuid: 'test-dip-uuid' }),
      content: vi.fn().mockResolvedValue({ documentsList: [] }),
    };
    await TestBed.configureTestingModule({
      imports: [DipDashboardContainer],
      providers:[{provide:ElectronIpc, useValue:electronIpcMock}],
    }).compileComponents();

    fixture = TestBed.createComponent(DipDashboardContainer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('test dettagli documento', async() => {
    const mockDetails = {
      uuid: 'doc-123',
      name: 'Documento test',
      attachments: []
    };
    electronIpcMock.getDocumentDetails.mockResolvedValue(mockDetails);

    await component.onDocumentSelected('doc-123');

    expect(electronIpcMock.getDocumentDetails).toHaveBeenCalledWith({documentUuid: 'doc-123'});
    expect(component.selectedDocument()).toEqual(mockDetails);
    expect(component.errorMessage()).toBeNull();
  });

  it('test ricerca documenti', async() => {
    const mockSearchResults = { results: [{ uuid: 'search-1', name: 'Trovato' }] };
    electronIpcMock.searchDocuments.mockResolvedValue(mockSearchResults);
    
    await component.onSearch([{ key: 'title', value: 'Trovato' } as any]);
    
    expect(component.documentList().length).toBe(1);
    expect((component.documentList()[0] as any).name).toBe('Trovato');
  });

  it('test export documento', async() => {
    electronIpcMock.exportFile.mockResolvedValue({ success: true });
    
    await component.onExport({ documentUuid: 'doc-123' });
    
    expect(electronIpcMock.exportFile).toHaveBeenCalledWith({ documentUuid: 'doc-123', fileUuid: undefined });
  });

  it('test Loading integrità', async() => {
    let integrityCallback: Function;
    electronIpcMock.on.mockImplementation((channel: string, callback: Function) => {
      if (channel === IPC_CHANNELS.DIP_CHECK_INTEGRITY_RESULT) {
        integrityCallback = callback;
      }
      return () => {};
    });

    (component as any).loadIntegrity('doc-123');

    expect(electronIpcMock.checkIntegrity).toHaveBeenCalledWith({ dipUuid: 'doc-123' });

    const mockResponse = {
      data: {
        integrity: { uuid: 'doc-123', status: true },
        attachments: [],
      },
    };

    integrityCallback!(mockResponse);

    expect(component.integrityMap().get('doc-123')).toBe(true);
  });

  it('test preview interno documento', async() =>{
    const mockDetails = {
      uuid: 'doc-123',
      name: 'test.pdf',
      extension: 'pdf',
      attachments: []
    };

    electronIpcMock.getDocumentDetails.mockResolvedValue(mockDetails);
    electronIpcMock.fileInternalPreview.mockResolvedValue({ 
    fileUrl: 'file:///Users/test-file.pdf' 
  });
    await component.onItemPreview({ documentUuid: 'doc-123'});
    expect(electronIpcMock.fileInternalPreview).toHaveBeenCalledWith({ documentUuid: 'doc-123', fileUuid: undefined });
    expect(component.documentFileUrl()).toBe('file:///Users/test-file.pdf');
    expect(component.previewItemFormato()).toBe('pdf'); 
  });

  it('test preview esterno documento', async() =>{
    const mockDetails = {
      uuid: 'doc-err',
      name: 'test.pdf',
      extension: 'pdf',
    };

    electronIpcMock.fileExternalPreview.mockResolvedValue(mockDetails);
    electronIpcMock.fileExternalPreview.mockResolvedValue({ 
    fileUrl: 'file:///Users/test-file.pdf' 
  });
    await component.onItemPreview({ documentUuid: 'doc-err'});
    expect(electronIpcMock.fileExternalPreview).toHaveBeenCalledWith({ documentUuid: 'doc-err', fileUuid: undefined });
    expect(component.documentFileUrl()).toBeNull(); 
  });

  it('test select allegato', async() => {
    const mockDetails = {
      uuid: 'doc-123',
      attachments:[{
        uuid: 'att-123',
        name: 'test.pdf',
      },
      {
        uuid: 'att-124',
        name: 'test.txt',
      }
    ]
    };

    electronIpcMock.getDocumentDetails.mockResolvedValue(mockDetails);
    await component.onAttachmentSelected({ documentUuid: 'doc-123', attachmentUuid: 'att-123' });
    expect(electronIpcMock.getDocumentDetails).toHaveBeenCalledWith({ documentUuid: 'doc-123' });
    expect(component.selectedAllegato()?.uuid).toBe('att-123');
  });

  it('test ngOnDestroy', () => {
    component.ngOnDestroy();
    expect(component.selectedDocument()).toBeNull();
    expect(component.selectedAllegato()).toBeNull();
    expect(component.previewSelectedDocument()).toBeNull();
  });


  it('dovrebbe gestire un errore dal backend correttamente', async() =>{
    electronIpcMock.getDocumentDetails.mockRejectedValue(new Error('Errore Backend'));

    await component.onDocumentSelected('doc-123');

    expect(component.selectedDocument()).toBeNull();
    expect(component.errorMessage()).toBe('Failed to load document details.');
  });
});
