import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DocumentPreview } from '../app/components/document-preview/document-preview';

describe('DocumentPreview', () => {
  let fixture: ComponentFixture<DocumentPreview>;
  let component: DocumentPreview;

  const document = {
    name: 'Documento demo',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentPreview);
    component = fixture.componentInstance;
  });

  it('mostra lo stato vuoto quando non è selezionato alcun documento', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      "Seleziona un documento per visualizzare l'anteprima.",
    );
  });

  it("mostra lo stato di caricamento quando l'anteprima è in generazione", () => {
    fixture.componentRef.setInput('isLoadingPreview', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Caricamento anteprima in corso...');
  });

  it("mostra anteprime PDF, immagini e formati non supportati, e resetta l'URL sicuro quando pulito", () => {
    fixture.componentRef.setInput('document', document);
    fixture.componentRef.setInput('documentFileUrl', 'https://example.com/documento.pdf');
    fixture.componentRef.setInput('itemFormato', 'pdf');
    fixture.detectChanges();

    expect(component.safeDocumentUrl).not.toBeNull();
    expect(fixture.nativeElement.querySelector('iframe')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Documento demo');

    fixture.componentRef.setInput('itemFormato', 'png');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img')).toBeTruthy();

    fixture.componentRef.setInput('itemFormato', 'txt');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      "Formato non supportato per l'anteprima locale.",
    );

    fixture.componentRef.setInput('documentFileUrl', null);
    fixture.detectChanges();

    expect(component.safeDocumentUrl).toBeNull();
    expect(fixture.nativeElement.textContent).toContain(
      "L'anteprima non è disponibile o il formato non è supportato per questo documento.",
    );
  });
});
