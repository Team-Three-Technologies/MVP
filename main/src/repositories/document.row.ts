export interface DocumentUuidRow {
  uuid_documento: string;
}

export interface DocumentWithMainFileRow {
  uuid: string;
  percorso: string;
  uuid_processo_conservazione: string;
  file_uuid: string;
  file_percorso: string;
  file_dimensione: string;
}
