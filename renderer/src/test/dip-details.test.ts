import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { DipDetails } from '../app/components/dip-details/dip-details';
import { DipContentResponseDTO } from '@shared/response/dip-content.response.dto';

describe('DipDetails', () => {
  let fixture: ComponentFixture<DipDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DipDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(DipDetails);
  });

  it('renders the empty state when no package is available', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Nessun pacchetto caricato');
  });

  it('renders package data when dip info is provided', () => {
    const dipInfo: DipContentResponseDTO = {
      uuid: 'dip-1',
      creationDate: new Date('2026-04-28T12:34:00Z'),
      documentNumber: 12,
      aipNumber: 3,
      documentsList: [],
    };

    fixture.componentRef.setInput('dipInfo', dipInfo);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('UUID DIP:');
    expect(text).toContain('dip-1');
    expect(text).toContain('Numero Documenti:');
    expect(text).toContain('12');
    expect(text).toContain('Numero AIP:');
    expect(text).toContain('3');
    expect(text).toContain('28/04/2026');
  });

  it('falls back to N/D for missing values', () => {
    fixture.componentRef.setInput('dipInfo', {
      uuid: '',
      creationDate: null,
      documentNumber: 0,
      aipNumber: 0,
      documentsList: [],
    } as any);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('N/D');
    expect((text.match(/N\/D/g) ?? []).length).toBeGreaterThanOrEqual(4);
  });
});
