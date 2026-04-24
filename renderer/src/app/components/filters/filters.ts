import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterModel } from '../../models/filter';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css',
})
export class Filters {
  @Output() searchRequested = new EventEmitter<FilterModel[]>();

  private readonly filtriNumerici = new Set([
    'Identificativo documento',
    'Numero documento',
    'Numero allegati',
    'Identificativo allegato',
    'Identificativo aggregazione',
    'Versione del documento',
    'Tempo di conservazione',
  ]);

  private readonly filtriData = new Set(['Data registrazione', 'Data modifica']);

  private readonly filtriOra = new Set(['Ora registrazione', 'Ora modifica']);

  private readonly filtriBooleani = new Set([
    'Riservato',
    'Firmato digitalmente',
    'Sigillato elettronicamente',
    'Marcatura temporale',
  ]);

  private readonly filtriPartitaIva = new Set(['Partita IVA']);

  private readonly filtriCodiceFiscale = new Set(['Codice Fiscale']);

  private readonly filtriConformita = new Set([
    'Conformità copie immagine su supporto informatico',
  ]);

  opzioniFiltro = [
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
    'Impronta crittografica allegato',
    'Impronta crittografica documento',
    'Identificativo allegato',
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
  filtriAttivi: FilterModel[] = [];

  addFilters(): void {
    this.filtriAttivi.push({ type: this.opzioniFiltro[0], value: '' });
  }

  removeFilters(index: number): void {
    this.filtriAttivi.splice(index, 1);
  }

  startSearch(): void {
    const filtriValidi = this.filtriAttivi
      .map((f) => ({
        type: f.type,
        value: f.value.trim(),
      }))
      .filter((f) => f.value !== '' && this.isValidForType(f.type, f.value));
      
    if (!this.checkAssociation()) {
      return;
    }
    // verso il padre
    this.searchRequested.emit(filtriValidi);
    console.log('Ricerca richiesta con filtri:', filtriValidi);
  }

  onFilterTypeChange(index: number, newType: string): void {
    const filtro = this.filtriAttivi[index];
    if (!filtro) {
      return;
    }

    filtro.type = newType;

    if (filtro.value.trim() !== '' && !this.isValidForType(newType, filtro.value)) {
      filtro.value = '';
    }
  }

  private isValidForType(filterType: string, rawValue: string): boolean {
    const value = rawValue.trim();
    if (value === '') {
      return true;
    }

    if (this.filtriData.has(filterType)) {
      return !isNaN(Date.parse(value));
    }

    if (this.filtriOra.has(filterType)) {
      return /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value);
    }

    if (this.filtriNumerici.has(filterType)) {
      return /^\d+$/.test(value);
    }

    if (this.filtriBooleani.has(filterType)) {
      const lowerValue = value.toLowerCase();
      return lowerValue === 'true' || lowerValue === 'false';
    }

    if (this.filtriConformita.has(filterType)) {
      const lowerValue = value.toLowerCase();
      return lowerValue === 'conforme' || lowerValue === 'non conforme';
    }

    if (this.filtriPartitaIva.has(filterType)) {
      return /^\d{11}$/.test(value);
    }

    if (this.filtriCodiceFiscale.has(filterType)) {
      return /^[A-Za-z0-9]{16}$/.test(value);
    }

    return true;
  }
}
