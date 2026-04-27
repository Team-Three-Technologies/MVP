import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DipDetails } from './dip-details';
import { DipContentResponseDTO } from '@shared/response/dip-content.response.dto';

describe('DipDetails', () => {
  let component: DipDetails;
  let fixture: ComponentFixture<DipDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DipDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(DipDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('dovrebbe visualizzare correttamente i dati provenienti dal backend (Integration DTO)', () => {
    const mockDipInfo: DipContentResponseDTO = {
      uuid: 'mock-uuid-1234',
      creationDate: new Date('2026-04-26T10:00:00Z'),
      documentNumber: 1,
      aipNumber: 2,
      documentsList: [],
    };
    fixture.componentRef.setInput('dipInfo', mockDipInfo);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.info-value')?.textContent).toContain('mock-uuid-1234');

    const highlightRow = compiled.querySelector('.info-row.highlight');
    expect(highlightRow?.textContent).toContain('1');
  });

  it('dovrebbe mostrare lo stato vuoto se non ci sono dati dal backend', () => {
    fixture.componentRef.setInput('dipInfo', null);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state p')?.textContent).toContain('Nessun pacchetto caricato');
  });
});
