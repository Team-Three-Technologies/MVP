CREATE TABLE IF NOT EXISTS archivi_dip (
    uuid_processo TEXT PRIMARY KEY,
    data_creazione TEXT NOT NULL,
    numero_documenti INTEGER NOT NULL,
    numero_aip INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS classi_documentali (
    uuid TEXT,
    nome TEXT NOT NULL,
    versione TEXT,
    valida_da TEXT NOT NULL,
    valida_fino TEXT,
    uuid_dip TEXT,
    PRIMARY KEY (uuid, versione),
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
    versione_classe_documentale TEXT,
    FOREIGN KEY (uuid_classe_documentale, versione_classe_documentale) REFERENCES classi_documentali(uuid, versione)
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
    uuid_file_principale TEXT NOT NULL,
    FOREIGN KEY (uuid_file_principale) REFERENCES files(uuid),
    FOREIGN KEY (uuid_processo_conservazione) REFERENCES processi_conservazione(uuid)
);

CREATE TABLE allegati (
    uuid_documento TEXT NOT NULL,
    uuid_file TEXT NOT NULL,
    FOREIGN KEY(uuid_documento) REFERENCES documenti(uuid),
    FOREIGN KEY(uuid_file) REFERENCES files(uuid),
    PRIMARY KEY(uuid_documento, uuid_file)
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS soggetti_pf (
    id INTEGER PRIMARY KEY,
    cognome TEXT NOT NULL,
    nome TEXT NOT NULL,
    cf TEXT,
    indirizzi_dig_riferimento TEXT,
    FOREIGN KEY (id) REFERENCES soggetti(id) 
);

CREATE TABLE IF NOT EXISTS soggetti_pg (
    id INTEGER PRIMARY KEY,
    den_organizzazione TEXT NOT NULL,
    p_iva TEXT,
    den_ufficio TEXT,
    indirizzi_dig_riferimento TEXT,
    FOREIGN KEY (id) REFERENCES soggetti(id)
);

CREATE TABLE IF NOT EXISTS soggetti_pai (
    id INTEGER PRIMARY KEY,
    den_amministrazione TEXT NOT NULL,
    codice_ipa TEXT NOT NULL,
    den_amministrazione_aoo TEXT,
    codice_ipa_aoo TEXT,
    den_amministrazione_uor TEXT,
    codice_ipa_uor TEXT,
    indirizzi_dig_riferimento TEXT,
    FOREIGN KEY (id) REFERENCES soggetti(id)
);

CREATE TABLE IF NOT EXISTS soggetti_pae (
    id INTEGER PRIMARY KEY,
    den_amministrazione TEXT NOT NULL,
    den_ufficio TEXT,
    indirizzi_dig_riferimento TEXT,
    FOREIGN KEY (id) REFERENCES soggetti(id)
);

CREATE TABLE IF NOT EXISTS soggetti_as (
    id INTEGER PRIMARY KEY,
    cognome TEXT,
    nome TEXT,
    cf TEXT,
    den_organizzazione TEXT NOT NULL,
    den_ufficio TEXT NOT NULL,
    indirizzi_dig_riferimento TEXT,
    FOREIGN KEY (id) REFERENCES soggetti(id)
);

CREATE TABLE IF NOT EXISTS soggetti_sw (
    id INTEGER PRIMARY KEY,
    den_sistema TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES soggetti(id)
);

CREATE TABLE IF NOT EXISTS ruoli (
    uuid_documento TEXT,
    id_soggetto INTEGER,
    ruolo TEXT,
    FOREIGN KEY (uuid_documento) REFERENCES documenti(uuid),
    FOREIGN KEY (id_soggetto) REFERENCES soggetti(id),
    PRIMARY KEY (uuid_documento, id_soggetto)
);
