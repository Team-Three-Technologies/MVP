import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DocumentList } from '../app/components/document-list/document-list';
import { DocumentEssentialsDTO } from '@shared/response/dip-content.response.dto';

describe('DocumentList', () => {
  let fixture: ComponentFixture<DocumentList>;
  let component: DocumentList;

  const documents: DocumentEssentialsDTO[] = [
    {
      documentUuid: 'doc-1',
      documentName: 'Documento uno',
      documentAttachments: [
        {
          uuid: 'att-1',
          name: 'Allegato uno',
        },
      ],
    },
    {
      documentUuid: 'doc-2',
      documentName: 'Documento due',
      documentAttachments: [],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentList],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentList);
    component = fixture.componentInstance;
  });

  it('mostra lo stato di caricamento quando richiesto', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Caricamento in corso...');
  });

  it('mostra lo stato di errore quando viene fornito un messaggio', () => {
    fixture.componentRef.setInput('errorMessage', 'Errore di caricamento');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Errore di caricamento');
  });

  it('mostra lo stato vuoto quando non ci sono documenti disponibili', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nessun documento trovato.');
  });

  it('mostra documenti, allegati ed emette eventi di selezione', () => {
    const selectedDocuments: string[] = [];
    const selectedAttachments: Array<{ documentUuid: string; attachmentUuid: string }> = [];
    const previewRequests: Array<{ documentUuid: string; attachmentUuid?: string }> = [];

    component.documentSelected.subscribe((value) => selectedDocuments.push(value));
    component.attachmentSelected.subscribe((value) => selectedAttachments.push(value));
    component.itemPreview.subscribe((value) => previewRequests.push(value));

    fixture.componentRef.setInput('documents', documents);
    fixture.componentRef.setInput(
      'integrityMap',
      new Map<string, boolean>([
        ['doc-1', true],
        ['att-1', false],
      ]),
    );
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Documento uno');
    expect(text).toContain('Documento due');
    expect(text).toContain('Allegato uno');
    expect(fixture.nativeElement.querySelector('.item-doc .btn-link.integrity-ok')).toBeTruthy();
    expect(
      fixture.nativeElement.querySelector('.item-allegato .btn-link.integrity-ko'),
    ).toBeTruthy();
    expect(component.getIntegrityStatus('doc-1')).toBe('ok');
    expect(component.getIntegrityStatus('att-1')).toBe('ko');
    expect(component.getIntegrityStatus('missing')).toBe('unknown');

    (fixture.nativeElement.querySelector('.item-doc .btn-link') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('.item-doc .btn-visualizza') as HTMLButtonElement).click();
    (
      fixture.nativeElement.querySelector(
        '.item-allegato .btn-link.btn-allegato',
      ) as HTMLButtonElement
    ).click();
    (
      fixture.nativeElement.querySelector(
        '.item-allegato .btn-visualizza-allegato',
      ) as HTMLButtonElement
    ).click();

    expect(selectedDocuments).toEqual(['doc-1']);
    expect(selectedAttachments).toEqual([{ documentUuid: 'doc-1', attachmentUuid: 'att-1' }]);
    expect(previewRequests).toEqual([
      { documentUuid: 'doc-1' },
      { documentUuid: 'doc-1', attachmentUuid: 'att-1' },
    ]);
  });
});
