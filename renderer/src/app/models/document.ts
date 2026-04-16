export interface Allegato {
  percorso: string;
  formato: string;
  id_allegato: string;
}

export interface DocumentModel {
  uuid_documento: string;
  nome_documento: string;
  formato: string;
  percorso: string;           
  data_registrazione: string;
  ora_registrazione: string;
  oggetto: string;
  versione: string;
  files_count: number;
  total_size: number;
  num_allegati: number;
  allegati: Allegato[];
}