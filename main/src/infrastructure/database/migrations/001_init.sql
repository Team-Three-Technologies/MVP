CREATE TABLE IF NOT EXISTS archivi_dip (
  uuid_processo TEXT PRIMARY KEY,
  data_creazione TEXT NOT NULL,
  numero_documenti INTEGER NOT NULL,
  numero_aip INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS classi_documentali (
  uuid TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  versione TEXT NOT NULL,
  valida_da TEXT NOT NULL,
  valida_fino TEXT,
  uuid_dip TEXT,
  FOREIGN KEY (uuid_dip) REFERENCES archivi_dip(uuid_processo)
);

CREATE TABLE IF NOT EXISTS processi_conservazione (
  uuid TEXT PRIMARY KEY,
  data_creazione TEXT NOT NULL,
  dimensione_totale TEXT NOT NULL,
  numero_sip INTEGER NOT NULL,
  numero_documenti INTEGER NOT NULL,
  numero_file_documenti INTEGER NOT NULL,
  uuid_classe_documentale TEXT,
  FOREIGN KEY (uuid_classe_documentale) REFERENCES classi_documentali(uuid)
);

CREATE TABLE IF NOT EXISTS files (
  uuid TEXT PRIMARY KEY,
  percorso TEXT NOT NULL,
  dimensione TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS documenti (
  uuid TEXT PRIMARY KEY,
  percorso TEXT NOT NULL,
  uuid_processo_conservazione TEXT,
  file_principale TEXT NOT NULL,
  FOREIGN KEY(file_principale) REFERENCES files(uuid),
  FOREIGN KEY (uuid_processo_conservazione) REFERENCES processi_conservazione(uuid)
);

CREATE TABLE allegati (
    uuid_doc TEXT NOT NULL,
    uuid_file TEXT NOT NULL,

    FOREIGN KEY(uuid_doc) REFERENCES documenti(uuid),
    FOREIGN KEY(uuid_file) REFERENCES files(uuid),
    PRIMARY KEY(uuid_doc, uuid_file)
);

CREATE TABLE IF NOT EXISTS metadata (
  nome TEXT,
  valore TEXT NOT NULL,
  tipo TEXT NOT NULL,
  uuid_documento TEXT,
  PRIMARY KEY (uuid_documento, nome),
  FOREIGN KEY (uuid_documento) REFERENCES documenti(uuid)
);

CREATE TABLE IF NOT EXISTS soggetti (
  id INTEGER PRIMARY KEY,
  tipo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS soggetti_pf (
  id INTEGER PRIMARY KEY,
  cognome TEXT NOT NULL,
  nome TEXT NOT NULL,
  cf TEXT,
  indirizzo_dig_riferimento TEXT,
  FOREIGN KEY (id) REFERENCES soggetto(id) 
);

CREATE TABLE IF NOT EXISTS soggetti_pg (
  id INTEGER PRIMARY KEY,
  den_organizzazione TEXT NOT NULL,
  p_iva TEXT,
  den_ufficio TEXT,
  indirizzo_dig_riferimento TEXT,
  FOREIGN KEY (id) REFERENCES soggetto(id)
);

CREATE TABLE IF NOT EXISTS soggetti_pai (
  id INTEGER PRIMARY KEY,
  codice_ipa TEXT NOT NULL,
  codice_ipa_aoo TEXT,
  codice_ipa_uor TEXT,
  indirizzo_dig_riferimento TEXT,
  FOREIGN KEY (id) REFERENCES soggetto(id)
);

CREATE TABLE IF NOT EXISTS soggetti_pae (
  id INTEGER PRIMARY KEY,
  den_amministrazione TEXT NOT NULL,
  den_ufficio TEXT,
  indirizzo_dig_riferimento TEXT,
  FOREIGN KEY (id) REFERENCES soggetto(id)
);

CREATE TABLE IF NOT EXISTS soggetto_as (
  id INTEGER PRIMARY KEY,
  cognome TEXT,
  nome TEXT,
  cf TEXT,
  den_organizzazione TEXT NOT NULL,
  den_ufficio TEXT NOT NULL,
  indirizzo_dig_riferimento TEXT,
  FOREIGN KEY (id) REFERENCES soggetto(id)
);

CREATE TABLE IF NOT EXISTS soggetto_sw (
  id INTEGER PRIMARY KEY,
  den_sistema TEXT NOT NULL,
  FOREIGN KEY(id) REFERENCES soggetto(id)
);

CREATE TABLE IF NOT EXISTS ruoli (
  uuid_documento TEXT,
  id_soggetto INTEGER,
  ruolo TEXT,
  FOREIGN KEY (uuid_documento) REFERENCES documenti(uuid),
  FOREIGN KEY (id_soggetto) REFERENCES soggetti(id),
  PRIMARY KEY (uuid_documento, id_soggetto)
);
