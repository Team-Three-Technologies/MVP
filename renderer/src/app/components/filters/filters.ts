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

  opzioniFiltro = [
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
    //validazione??
    const filtriValidi = this.filtriAttivi.filter((f) => f.value.trim() !== '');

    // verso il padre
    this.searchRequested.emit(filtriValidi);
    console.log('Ricerca richiesta con filtri:', filtriValidi);
  }
}
