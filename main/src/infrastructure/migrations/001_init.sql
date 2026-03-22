CREATE TABLE IF NOT EXISTS pacchetti_dip (
  hash TEXT PRIMARY KEY,
  uuid_processo TEXT UNIQUE NOT NULL,
  data_creazione TEXT NOT NULL,
  numero_documenti INTEGER NOT NULL,
  numero_aip INTEGER NOT NULL
);