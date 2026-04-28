import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFilterDTO } from '@shared/request/search.request.dto';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  @Output() searchRequested = new EventEmitter<SearchFilterDTO[]>();

  readonly filtriDropdown = new Set([
    'Modalità di formazione',
    'Tipologia di flusso',
    'Tipo registro',
    'Ruolo',
    'Tipo soggetto',
    'Tipo aggregazione',
    'Tipologia fascicolo',
    'Tipo modifica',
    'Conformità copie immagine su supporto informatico',
    'Impronta crittografica documento (algoritmo)',
    'Impronta crittografica allegato (algoritmo)',
  ]);

  readonly filtriBooleani = new Set([
    'Riservato',
    'Firmato digitalmente',
    'Sigillato elettronicamente',
    'Marcatura temporale',
  ]);

  private readonly filtriData = new Set(['Data registrazione', 'Data modifica']);
  private readonly filtriOra = new Set(['Ora registrazione', 'Ora modifica']);

  private readonly filtriNumerici = new Set([
    'Numero documento',
    'Numero allegati',
    'Versione del documento',
    'Tempo di conservazione',
  ]);

  private readonly filtriPartitaIva = new Set(['Partita IVA']);
  private readonly filtriCodiceFiscale = new Set(['Codice Fiscale']);
  private readonly ruoliPersoneFisiche = [
    'Altro',
    'Assegnatario',
    'Autore',
    'Destinatario',
    'Mittente',
    'Operatore',
    'Responsabile del Servizio Protocollo',
    'Responsabile della Gestione Documentale',
    'Soggetto che effettua la registrazione',
  ];

  readonly opzioniPerDropdown: Record<string, { label: string; value: string }[]> = {
    'Modalità di formazione': [
      {
        label: 'Creazione tramite strumenti software conformi',
        value:
          'creazione tramite strumenti software conformi a quanto disposto dall articolo 3 del presente decreto',
      },
      {
        label: 'Acquisizione da via telematica o supporto informatico',
        value:
          'acquisizione di un documento informatico per via telematica o su supporto informatico',
      },
      {
        label: 'Memorizzazione da transazioni/processi informatici o moduli online',
        value:
          'memorizzazione di informazioni risultanti da transazioni o processi informatici o dalla presentazione telematica di moduli o formulari',
      },
      {
        label: 'Generazione automatica da banche dati',
        value:
          'generazione o raggruppamento anche in via automatica di un insieme di dati o registrazioni provenienti da una o più banche dati anche appartenenti a più soggetti interoperanti secondo una struttura logica predeterminata e memorizzata in forma statica',
      },
    ],
    'Tipologia di flusso': [
      { label: 'U (In uscita)', value: 'U' },
      { label: 'E (In entrata)', value: 'E' },
      { label: 'I (Interno)', value: 'I' },
    ],
    'Tipo registro': [
      { label: 'Nessuno', value: 'Nessuno' },
      {
        label: 'Protocollo ordinario/Protocollo emergenza',
        value: 'Protocollo ordinario Protocollo emergenza',
      },
      { label: 'Repertorio/Registro', value: 'Repertorio Registro' },
    ],
    Ruolo: [
      { label: 'Assegnatario', value: 'Assegnatario' },
      { label: 'Autore', value: 'Autore' },
      { label: 'Destinatario', value: 'Destinatario' },
      { label: 'Mittente', value: 'Mittente' },
      { label: 'Operatore', value: 'Operatore' },
      { label: 'Produttore', value: 'Produttore' },
      { label: 'RGD', value: 'RGD' },
      { label: 'RSP', value: 'RSP' },
      {
        label: 'Soggetto che effettua la registrazione',
        value: 'Soggetto Che Effettua La Registrazione',
      },
      { label: 'Altro', value: 'Altro' },
    ],
    'Tipo soggetto': [
      { label: 'AS', value: 'AS' },
      { label: 'PAE', value: 'PAE' },
      { label: 'PAI', value: 'PAI' },
      { label: 'PF', value: 'PF' },
      { label: 'PG', value: 'PG' },
      { label: 'SW', value: 'SW' },
    ],
    'Tipo aggregazione': [
      { label: 'Fascicolo', value: 'Fascicolo' },
      { label: 'Serie documentale', value: 'Serie documentale' },
      { label: 'Serie di fascicoli', value: 'Serie di fascicoli' },
    ],
    'Tipologia fascicolo': [
      { label: 'Affare', value: 'Affare' },
      { label: 'Attività', value: 'Attività' },
      { label: 'Persona fisica', value: 'Persona fisica' },
      { label: 'Persona giuridica', value: 'Persona giuridica' },
      { label: 'Procedimento amministrativo', value: 'Procedimento amministrativo' },
    ],
    'Tipo modifica': [
      { label: 'Annullamento', value: 'Annullamento' },
      { label: 'Annotazione', value: 'Annotazione' },
      { label: 'Integrazione', value: 'Integrazione' },
      { label: 'Rettifica', value: 'Rettifica' },
    ],
    'Conformità copie immagine su supporto informatico': [
      { label: 'Conforme', value: 'true' },
      { label: 'Non conforme', value: 'false' },
    ],
    'Impronta crittografica documento (algoritmo)': [
      { label: 'SHA-256', value: 'SHA-256' },
      { label: 'SHA-384', value: 'SHA-384' },
      { label: 'SHA-512', value: 'SHA-512' },
    ],
    'Impronta crittografica allegato (algoritmo)': [
      { label: 'SHA-256', value: 'SHA-256' },
      { label: 'SHA-384', value: 'SHA-384' },
      { label: 'SHA-512', value: 'SHA-512' },
    ],
  };

  private readonly dipendenze: Record<string, (filtri: SearchFilterDTO[]) => boolean> = {
    'Tipologia fascicolo': (f) =>
      f.some((x) => x.type === 'Tipo aggregazione' && x.value === 'Fascicolo'),
    Cognome: (f) => f.some((x) => x.type === 'Tipo soggetto' && ['AS', 'PF'].includes(x.value)),
    Nome: (f) => f.some((x) => x.type === 'Tipo soggetto' && ['AS', 'PF'].includes(x.value)),
    'Codice Fiscale': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && ['AS', 'PF', 'PG'].includes(x.value)),
    'Partita IVA': (f) => f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PG'),
    'Codice IPA': (f) => f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Codice IPA AOO': (f) => f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Codice IPA UOR': (f) => f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Denominazione amministrazione': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Denominazione amministrazione AOO': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Denominazione amministrazione UOR': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Denominazione ufficio': (f) => f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Denominazione sistema': (f) =>
      f.some((x) => x.type === 'Ruolo' && x.value === 'Produttore') &&
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'SW'),
    'Impronta crittografica documento (algoritmo)': (f) =>
      f.some((x) => x.type === 'Impronta crittografica documento (hash)'),
    'Impronta crittografica allegato (algoritmo)': (f) =>
      f.some((x) => x.type === 'Impronta crittografica allegato (hash)'),
  };

  private readonly tuttiFiltri: string[] = [
    'Identificativo documento (UUID)',
    'Modalità di formazione',
    'Tipologia documentale',
    'Tipologia di flusso',
    'Tipo registro',
    'Data registrazione',
    'Ora registrazione',
    'Numero documento',
    'Codice registro',
    'Ruolo',
    'Tipo soggetto',
    'Cognome',
    'Nome',
    'Codice Fiscale',
    'Indirizzo digitale',
    'Denominazione organizzazione',
    'Partita IVA',
    'Denominazione ufficio',
    'Denominazione amministrazione',
    'Codice IPA',
    'Denominazione amministrazione AOO',
    'Codice IPA AOO',
    'Denominazione amministrazione UOR',
    'Codice IPA UOR',
    'Denominazione sistema',
    'Oggetto',
    'Parola chiave',
    'Numero allegati',
    'Impronta crittografica documento (hash)',
    'Impronta crittografica documento (algoritmo)',
    'Impronta crittografica allegato (hash)',
    'Impronta crittografica allegato (algoritmo)',
    'Identificativo allegato (UUID)',
    'Descrizione allegato',
    'Indice di classificazione',
    'Descrizione dell vindice di classificazione',
    'Piano di classificazione',
    'Riservato',
    'Formato',
    'Nome prodotto software',
    'Versione prodotto software',
    'Produttore software',
    'Firmato digitalmente',
    'Sigillato elettronicamente',
    'Marcatura temporale',
    'Conformità copie immagine su supporto informatico',
    'Tipo aggregazione',
    'Identificativo aggregazione',
    'Tipologia fascicolo',
    'Nome del documento',
    'Versione del documento',
    'Tipo modifica',
    'Data modifica',
    'Ora modifica',
    'Tempo di conservazione',
    'Note',
  ];

  filtriAttivi: SearchFilterDTO[] = [];

  opzioniDisponibili(currentIndex: number): string[] {
    const tipiAltreRighe = new Set(
      this.filtriAttivi.filter((_, i) => i !== currentIndex).map((f) => f.type),
    );
    return this.tuttiFiltri.filter((opzione) => {
      if (tipiAltreRighe.has(opzione)) return false;
      const dipendenza = this.dipendenze[opzione];
      if (dipendenza && !dipendenza(this.filtriAttivi)) return false;
      return true;
    });
  }

  addFilters(): void {
    const disponibili = this.opzioniDisponibili(this.filtriAttivi.length);
    if (disponibili.length === 0) return;
    const tipo = disponibili[0];
    this.filtriAttivi.push({
      type: tipo,
      value: this.filtriDropdown.has(tipo) ? this.opzioniPerDropdown[tipo][0].value : '',
    });
  }

  removeFilters(index: number): void {
    this.filtriAttivi.splice(index, 1);
    this._rimuoviDipendentiInvalidi();
    this.startSearch();
  }

  onFilterTypeChange(index: number, newType: string): void {
    const filtro = this.filtriAttivi[index];
    if (!filtro) return;
    filtro.type = newType;
    filtro.value = this.filtriDropdown.has(newType)
      ? this.opzioniPerDropdown[newType][0].value
      : '';
    this._rimuoviDipendentiInvalidi();
  }

  onFilterValueChange(): void {
    this._rimuoviDipendentiInvalidi();
  }

  startSearch(): void {
    const filtriValidi = this.filtriAttivi
      .map((f) => ({ type: f.type, value: f.value.trim() }))
      .filter((f) => f.value !== '' && this.isValidForType(f.type, f.value));
    this.searchRequested.emit(filtriValidi);
    console.log('Ricerca richiesta con filtri:', filtriValidi);
  }

  isDropdownFilter(type: string): boolean {
    return this.filtriDropdown.has(type);
  }
  isBooleanFilter(type: string): boolean {
    return this.filtriBooleani.has(type);
  }
  isDateFilter(type: string): boolean {
    return this.filtriData.has(type);
  }
  isTimeFilter(type: string): boolean {
    return this.filtriOra.has(type);
  }
  getDropdownOptions(type: string): { label: string; value: string }[] {
    return this.opzioniPerDropdown[type] ?? [];
  }

  private isValidForType(filterType: string, rawValue: string): boolean {
    const value = rawValue.trim();
    if (value === '') return true;

    if (this.filtriData.has(filterType)) {
      return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
    }
    if (this.filtriOra.has(filterType)) {
      return /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value);
    }
    if (this.filtriNumerici.has(filterType)) {
      return /^\d+$/.test(value);
    }
    if (this.filtriBooleani.has(filterType)) {
      return value === 'true' || value === 'false';
    }
    if (this.filtriDropdown.has(filterType)) {
      return (this.opzioniPerDropdown[filterType] ?? []).some((opt) => opt.value === value);
    }
    if (this.filtriPartitaIva.has(filterType)) {
      return /^\d{11}$/.test(value);
    }
    if (this.filtriCodiceFiscale.has(filterType)) {
      return /^([A-Za-z0-9]{16}|\d{11})$/.test(value);
    }
    return true;
  }

  private _rimuoviDipendentiInvalidi(): void {
    let changed = true;
    while (changed) {
      const prev = [...this.filtriAttivi];
      this.filtriAttivi = prev.filter((filtro) => {
        const dipendenza = this.dipendenze[filtro.type];
        return !dipendenza || dipendenza(prev);
      });
      changed = this.filtriAttivi.length !== prev.length;
    }
  }
}
