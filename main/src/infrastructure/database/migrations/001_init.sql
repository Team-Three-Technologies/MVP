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
