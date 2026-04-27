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
    FOREIGN KEY (uuid_dip) REFERENCES archivi_dip(uuid_processo) ON DELETE CASCADE
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
    FOREIGN KEY (uuid_classe_documentale, versione_classe_documentale) REFERENCES classi_documentali(uuid, versione) ON DELETE CASCADE
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
    FOREIGN KEY (uuid_file_principale) REFERENCES files(uuid) ON DELETE CASCADE,
    FOREIGN KEY (uuid_processo_conservazione) REFERENCES processi_conservazione(uuid) ON DELETE CASCADE
);

CREATE TABLE allegati (
    uuid_documento TEXT NOT NULL,
    uuid_file TEXT NOT NULL,
    FOREIGN KEY(uuid_documento) REFERENCES documenti(uuid) ON DELETE CASCADE,
    FOREIGN KEY(uuid_file) REFERENCES files(uuid) ON DELETE CASCADE,
    PRIMARY KEY(uuid_documento, uuid_file)
);

CREATE TABLE IF NOT EXISTS metadata (
    nome TEXT,
    valore TEXT NOT NULL COLLATE NOCASE,
    tipo TEXT NOT NULL,
    uuid_documento TEXT,
    PRIMARY KEY (uuid_documento, nome),
    FOREIGN KEY (uuid_documento) REFERENCES documenti(uuid) ON DELETE CASCADE
);

CREATE TRIGGER IF NOT EXISTS allegati_delete_files AFTER DELETE ON allegati BEGIN
    DELETE FROM files
    WHERE uuid = old.uuid_file
    AND NOT EXISTS (
        SELECT 1 FROM allegati WHERE uuid_file = old.uuid_file
        AND uuid_documento != old.uuid_documento
    );
END;

CREATE TRIGGER IF NOT EXISTS documenti_delete_main_file AFTER DELETE ON documenti BEGIN
    DELETE FROM files 
    WHERE uuid = old.uuid_file_principale
    AND NOT EXISTS (
        SELECT 1 FROM documenti WHERE uuid_file_principale = old.uuid_file_principale
    );
END;
