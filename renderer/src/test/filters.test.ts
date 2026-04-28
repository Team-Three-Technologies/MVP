import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { Filters } from '../app/components/filters/filters';
import { SearchFilterDTO } from '@shared/request/search.request.dto';

describe('Filters', () => {
  let fixture: ComponentFixture<Filters>;
  let component: Filters;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filters],
    }).compileComponents();

    fixture = TestBed.createComponent(Filters);
    component = fixture.componentInstance;
  });

  it('mostra i diversi controlli di input per i tipi di filtro supportati', () => {
    component.filtriAttivi = [
      {
        type: 'Modalità di formazione',
        value: component.getDropdownOptions('Modalità di formazione')[0].value,
      },
      { type: 'Riservato', value: 'true' },
      { type: 'Data registrazione', value: '2026-04-28' },
      { type: 'Ora registrazione', value: '12:34:56' },
      { type: 'Numero documento', value: '42' },
    ];

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('select.select-tipo')).toHaveLength(5);
    expect(root.querySelectorAll('select.input-testo')).toHaveLength(2);
    expect(root.querySelector('input[type="date"]')).toBeTruthy();
    expect(root.querySelector('input[type="time"]')).toBeTruthy();
    expect(root.querySelector('input[type="text"]')).toBeTruthy();
    expect(root.querySelector('.btn-aggiungi')).toBeTruthy();
    expect(root.querySelector('.btn-cerca')).toBeTruthy();

    const updateValue = (element: HTMLInputElement | HTMLSelectElement, value: string): void => {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
      fixture.detectChanges();
    };

    const firstRow = () => root.querySelectorAll('.riga-filtro')[0] as HTMLElement;
    const secondRow = () => root.querySelectorAll('.riga-filtro')[1] as HTMLElement;
    const thirdRow = () => root.querySelectorAll('.riga-filtro')[2] as HTMLElement;
    const fourthRow = () => root.querySelectorAll('.riga-filtro')[3] as HTMLElement;
    const fifthRow = () => root.querySelectorAll('.riga-filtro')[4] as HTMLElement;

    updateValue(firstRow().querySelector('select.select-tipo') as HTMLSelectElement, 'Ruolo');
    expect(component.filtriAttivi[0].type).toBe('Ruolo');
    expect(component.filtriAttivi[0].value).toBe('Assegnatario');

    updateValue(firstRow().querySelector('select.input-testo') as HTMLSelectElement, 'RSP');
    updateValue(secondRow().querySelector('select.input-testo') as HTMLSelectElement, 'false');
    updateValue(thirdRow().querySelector('input[type="date"]') as HTMLInputElement, '2026-04-29');
    updateValue(fourthRow().querySelector('input[type="time"]') as HTMLInputElement, '13:45:01');
    updateValue(fifthRow().querySelector('input[type="text"]') as HTMLInputElement, '43');

    expect(component.filtriAttivi[0].value).toBe('RSP');
    expect(component.filtriAttivi[1].value).toBe('false');
    expect(component.filtriAttivi[2].value).toBe('2026-04-29');
    expect(component.filtriAttivi[3].value).toBe('13:45:01');
    expect(component.filtriAttivi[4].value).toBe('43');
  });

  it('aggiunge filtri tramite il pulsante e rimuove i filtri dipendenti quando i valori cambiano', () => {
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.btn-aggiungi') as HTMLButtonElement).click();

    expect(component.filtriAttivi).toEqual([
      {
        type: 'Identificativo documento (UUID)',
        value: '',
      },
    ]);

    component.filtriAttivi = [
      { type: 'Tipo aggregazione', value: 'Serie documentale' },
      { type: 'Tipologia fascicolo', value: 'Affare' },
      { type: 'Tipo soggetto', value: 'PF' },
    ];

    component.onFilterValueChange();

    expect(component.filtriAttivi).toEqual([
      { type: 'Tipo aggregazione', value: 'Serie documentale' },
      { type: 'Tipo soggetto', value: 'PF' },
    ]);
    expect(component.opzioniDisponibili(0)).toContain('Cognome');
    expect(component.opzioniDisponibili(0)).toContain('Nome');
    expect(component.opzioniDisponibili(0)).not.toContain('Partita IVA');

    component.onFilterTypeChange(1, 'Ruolo');

    expect(component.filtriAttivi[1].value).toBe('Assegnatario');
    expect(component.getDropdownOptions('Ruolo').some((option) => option.value === 'RSP')).toBe(
      true,
    );
  });

  it('emette solo filtri validi quando viene avviata una ricerca', () => {
    const emitted: SearchFilterDTO[][] = [];
    component.searchRequested.subscribe((value) => emitted.push(value));

    const dropdownValue = component.getDropdownOptions('Modalità di formazione')[0].value;

    component.filtriAttivi = [
      { type: 'Data registrazione', value: '2026-04-28' },
      { type: 'Data registrazione', value: '28/04/2026' },
      { type: 'Ora registrazione', value: '12:34:56' },
      { type: 'Ora registrazione', value: '99:99:99' },
      { type: 'Numero documento', value: '42' },
      { type: 'Numero documento', value: 'forty-two' },
      { type: 'Riservato', value: 'true' },
      { type: 'Riservato', value: 'maybe' },
      { type: 'Modalità di formazione', value: dropdownValue },
      { type: 'Modalità di formazione', value: 'invalid' },
      { type: 'Partita IVA', value: '12345678901' },
      { type: 'Partita IVA', value: '123' },
      { type: 'Codice Fiscale', value: 'ABCDEF12G34H567I' },
      { type: 'Codice Fiscale', value: 'abcdef' },
      { type: 'Campo libero', value: '  testo  ' },
    ];

    component.startSearch();

    expect(emitted).toEqual([
      [
        { type: 'Data registrazione', value: '2026-04-28' },
        { type: 'Ora registrazione', value: '12:34:56' },
        { type: 'Numero documento', value: '42' },
        { type: 'Riservato', value: 'true' },
        { type: 'Modalità di formazione', value: dropdownValue },
        { type: 'Partita IVA', value: '12345678901' },
        { type: 'Codice Fiscale', value: 'ABCDEF12G34H567I' },
        { type: 'Campo libero', value: 'testo' },
      ],
    ]);

    expect((component as any).isValidForType('Numero documento', '   ')).toBe(true);
  });

  it('rimuove le righe tramite il pulsante elimina e avvia una nuova ricerca', () => {
    const emitted: SearchFilterDTO[][] = [];
    component.searchRequested.subscribe((value) => emitted.push(value));

    component.filtriAttivi = [{ type: 'Numero documento', value: '42' }];
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.btn-icona') as HTMLButtonElement).click();

    expect(component.filtriAttivi).toHaveLength(0);
    expect(emitted).toEqual([[]]);
  });
});
