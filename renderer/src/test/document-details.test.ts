import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DocumentDetails } from '../app/components/document-details/document-details';
import { DocumentDetailsResponseDTO } from '@shared/response/document-details.response.dto';

describe('DocumentDetails', () => {
  let fixture: ComponentFixture<DocumentDetails>;
  let component: DocumentDetails;

  const document: DocumentDetailsResponseDTO = {
    uuid: 'doc-1',
    name: 'Documento test.pdf',
    extension: 'pdf',
    registrationType: 'Protocollo',
    registrationDate: '2026-04-28',
    registrationTime: '12:34:56',
    content: 'Contenuto del documento',
    version: '1.0',
    filesCount: 2,
    totalSize: '10 KB',
    attachmentsCount: 2,
    attachments: [
      {
        uuid: 'att-1',
        path: 'cartella/allegato.pdf',
        extension: 'pdf',
      },
      {
        uuid: 'att-2',
        path: 'allegato.txt',
        extension: 'txt',
      },
    ],
    documentType: 'Tipo documento',
    documentNumber: '123',
    registryCode: 'REG-1',
    aggregationType: 'Fascicolo',
    subjects: [
      {
        id: 1,
        role: 'Autore',
        name: 'Mario Rossi',
        type: 'PF',
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentDetails);
    component = fixture.componentInstance;
  });

  it('mostra lo stato di caricamento quando richiesto', () => {
    fixture.componentRef.setInput('isLoading', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Caricamento dettagli...');
  });

  it('mostra lo stato vuoto quando non è selezionato nulla', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Seleziona un documento per visualizzarne i dettagli.',
    );
  });

  it('mostra i dettagli del documento, i soggetti e gli allegati', () => {
    const emitted: Array<{ documentUuid: string; fileUuid?: string }> = [];
    component.export.subscribe((value) => emitted.push(value));

    fixture.componentRef.setInput('document', document);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Dettagli Documento');
    expect(text).toContain('Documento test.pdf');
    expect(text).toContain('Mario Rossi');
    expect(text).toContain('allegato.pdf');
    expect(text).toContain('allegato.txt');
    expect(fixture.nativeElement.querySelectorAll('.soggetto-item')).toHaveLength(1);
    expect(fixture.nativeElement.querySelectorAll('.allegato-item')).toHaveLength(2);

    (fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement).click();

    expect(emitted).toEqual([{ documentUuid: 'doc-1' }]);
  });

  it('mostra messaggi di relazione vuota quando mancano soggetti e allegati', () => {
    fixture.componentRef.setInput('document', {
      ...document,
      subjects: [],
      attachments: [],
      attachmentsCount: 0,
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Nessun soggetto specificato.');
    expect(text).toContain('Nessun allegato presente.');
  });

  it('mostra i dettagli dell\'allegato ed esporta il file selezionato', () => {
    const emitted: Array<{ documentUuid: string; fileUuid?: string }> = [];
    component.export.subscribe((value) => emitted.push(value));

    fixture.componentRef.setInput('document', document);
    fixture.componentRef.setInput('allegato', document.attachments[0]);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Dettagli Allegato');
    expect(text).toContain('allegato.pdf');
    expect(text).toContain('att-1');

    (fixture.nativeElement.querySelector('.btn-primary') as HTMLButtonElement).click();

    expect(emitted).toEqual([{ documentUuid: 'doc-1', fileUuid: 'att-1' }]);
  });
});
