import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchFilterDTO } from '@shared/request/search-filter.request.dto';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  @Output() searchRequested = new EventEmitter<SearchFilterDTO[]>();


  // I filtri (hash) sono testo libero; i filtri (algoritmo) sono dropdown con dipendenza
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

  // ── Valori predefiniti per i dropdown (UC08, UC10, UC11, UC16, UC17, UC49, UC50, UC52, UC55) ──

  readonly opzioniPerDropdown: Record<string, string[]> = {
    'Modalità di formazione': [
      'Creazione tramite strumenti software conformi',
      'Acquisizione da via telematica o supporto informatico',
      'Memorizzazione da transazioni/processi informatici o moduli online',
      'Generazione automatica da banche dati',
    ],
    'Tipologia di flusso': ['U (In uscita)', 'E (In entrata)', 'I (Interno)'],
    'Tipo registro': [
      'Nessuno',
      'Protocollo ordinario/Protocollo emergenza',
      'Repertorio/Registro',
    ],
    'Ruolo': [
      'Assegnatario',
      'Autore',
      'Destinatario',
      'Mittente',
      'Operatore',
      'Produttore',
      'RGD',
      'RSP',
      'Soggetto che effettua la registrazione',
      'Altro',
    ],
    'Tipo soggetto': ['AS', 'PAE', 'PAI', 'PF', 'PG', 'SW'],
    'Tipo aggregazione': ['Fascicolo', 'Serie documentale', 'Serie di fascicoli'],
    'Tipologia fascicolo': [
      'Affare',
      'Attività',
      'Persona fisica',
      'Persona giuridica',
      'Procedimento amministrativo',
    ],
    'Tipo modifica': ['Annullamento', 'Annotazione', 'Integrazione', 'Rettifica'],
    'Conformità copie immagine su supporto informatico': ['Conforme', 'Non conforme'],
    'Impronta crittografica documento (algoritmo)': ['SHA-256', 'SHA-384', 'SHA-512'],
    'Impronta crittografica allegato (algoritmo)': ['SHA-256', 'SHA-384', 'SHA-512'],
  };

  // ── Dipendenze logiche (UC18–UC31, UC52) ──────────────────────

  private readonly dipendenze: Record<string, (filtri: SearchFilterDTO[]) => boolean> = {
    'Tipologia fascicolo': (f) =>
      f.some((x) => x.type === 'Tipo aggregazione' && x.value === 'Fascicolo'),
    Cognome: (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && ['AS', 'PF'].includes(x.value)),
    Nome: (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && ['AS', 'PF'].includes(x.value)),
    'Codice Fiscale': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && ['AS', 'PF', 'PG'].includes(x.value)),
    'Partita IVA': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PG'),
    'Codice IPA': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Codice IPA AOO': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Codice IPA UOR': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Denominazione amministrazione': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Denominazione amministrazione AOO': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Denominazione amministrazione UOR': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Denominazione ufficio': (f) =>
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'PAI'),
    'Denominazione sistema': (f) =>
      f.some((x) => x.type === 'Ruolo' && x.value === 'Produttore') &&
      f.some((x) => x.type === 'Tipo soggetto' && x.value === 'SW'),
    // UC06 — (algoritmo) disponibile solo se il filtro (hash) corrispondente è presente
    'Impronta crittografica documento (algoritmo)': (f) =>
      f.some((x) => x.type === 'Impronta crittografica documento (hash)'),
    // UC35 — idem per allegato
    'Impronta crittografica allegato (algoritmo)': (f) =>
      f.some((x) => x.type === 'Impronta crittografica allegato (hash)'),
  };

  // ── Lista master di tutti i filtri disponibili ────────────────

  private readonly tuttiFiltri: string[] = [
    'Identificativo documento',
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
    'Descrizione dell’indice di classificazione',
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
      value: this.filtriDropdown.has(tipo) ? this.opzioniPerDropdown[tipo][0] : '',
    });
  }

  removeFilters(index: number): void {
    this.filtriAttivi.splice(index, 1);
    this._rimuoviDipendentiInvalidi();
  }

  onFilterTypeChange(index: number, newType: string): void {
    const filtro = this.filtriAttivi[index];
    if (!filtro) return;
    filtro.type = newType;
    filtro.value = this.filtriDropdown.has(newType) ? this.opzioniPerDropdown[newType][0] : '';
    delete filtro.algorithm;
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
  getDropdownOptions(type: string): string[] {
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
      return (this.opzioniPerDropdown[filterType] ?? []).includes(value);
    }
    if (this.filtriPartitaIva.has(filterType)) {
      return /^\d{11}$/.test(value);
    }
    if (this.filtriCodiceFiscale.has(filterType)) {
      return /^[A-Za-z0-9]{16}$/.test(value);
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
