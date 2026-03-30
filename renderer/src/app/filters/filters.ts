import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

interface Filtro { tipo: string; valore: string; }

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './filters.html',
  styleUrls: ['./filters.css'] 
})
export class Filters {


  //si potrebbero dividere in sottocategorie tipo Identificativi, Soggetti... con delle label
opzioniFiltro = [
  "Identificativo documento",
  "Modalità di formazione",
  "Tipologia documentale",
  "Tipologia di flusso",
  "Tipo registro",
  "Data registrazione",
  "Ora registrazione",    //si potrebbe mettere il type per tutti cosi da avere diverse caselle di testo in base all'input che ci va
  "Numero documento",
  "Codice registro",
  "Ruolo",
  "Tipo soggetto",
  "Cognome",
  "Nome",
  "Codice Fiscale",
  "Indirizzo digitale",
  "Denominazione organizzazione",
  "Partita IVA",
  "Denominazione ufficio",
  "Denominazione amministrazione",
  "Codice IPA",
  "Denominazione amministrazione AOO",
  "Codice IPA AOO",
  "Denominazione amministrazione UOR",
  "Codice IPA UOR",
  "Denominazione sistema",
  "Oggetto",
  "Parola chiave",
  "Numero allegati",
  "Impronta crittografica allegato",
  "Identificativo allegato",
  "Descrizione allegato",
  "Indice di classificazione",
  "Descrizione dell’indice di classificazione",
  "Piano di classificazione",
  "Riservato",
  "Formato",
  "Nome prodotto software",
  "Versione prodotto software",
  "Produttore software",
  "Firmato digitalmente",
  "Sigillato elettronicamente",
  "Marcatura temporale",
  "Conformità copie immagine su supporto informatico",
  "Tipo aggregazione",
  "Identificativo aggregazione",
  "Tipologia fascicolo",
  "Nome del documento",
  "Versione del documento",
  "Tipo modifica",
  "Data modifica",
  "Ora modifica",
  "Tempo di conservazione",
  "Note"
];
  filtriAttivi: Filtro[] = [];
  
  dettagli_dip = {
    nome_file: "dip_struttura_base.zip",
    processUUID: "00000000-0000-0000-0000-000000000000",
    creation_date: "2026-03-29",
    documents_count: 1,
    aip_count: 1
  };

  // doc prova
  risultati: any[] = [
    {
      uuid_documento: "doc-mvp-001",
      nome_documento: "Documento di Test UI",
      oggetto: "Test visivo dell'interfaccia",
      versione: "1.0",
      files_count: 2,
      total_size: 2048,
      num_allegati: 1,
      allegati: [
        { percorso: "/test/file_finto.pdf", formato: "application/pdf" }
      ]
    }
  ]; 

  documentoSelezionato: any = null;

  addFilters() {
    this.filtriAttivi.push({ tipo: this.opzioniFiltro[0], valore: '' });
  }

  removeFilters(index: number) {
    this.filtriAttivi.splice(index, 1);
  }

  startSearch() {
    console.log("Ricerca premuta! Filtri attuali:", this.filtriAttivi);
  }
}