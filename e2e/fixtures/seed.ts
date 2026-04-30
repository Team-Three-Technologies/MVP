import Database from 'better-sqlite3';

// Dati noti che useremo per verificare il risultato
export const TEST_DIP_UUID = 'test-dip-uuid-1234';
export const TEST_CLASS_UUID = 'test-class-uuid-1111';
export const TEST_CLASS_VERSION = '1.0.0';
export const TEST_PROCESS_UUID = 'test-processo-uuid-5678';
export const TEST_FILE_UUID = 'test-file-uuid-9012';
export const TEST_FILE_UUID_2 = 'test-file-uuid-9013';
export const TEST_FILE_ATTACHMENT_UUID = 'test-attachment-uuid-9014';
export const TEST_DOCUMENT_UUID = 'test-doc-uuid-3456';
export const TEST_DOCUMENT_UUID_2 = 'test-doc-uuid-3457';

export function seedDatabase(dbPath: string): void {
  const db = new Database(dbPath);
  
  db.prepare(`
    INSERT INTO archivi_dip (uuid_processo, data_creazione, numero_documenti, numero_aip)
    VALUES (?, ?, ?, ?)
  `).run(TEST_DIP_UUID, new Date().toISOString(), 2, 1);

  db.prepare(`
    INSERT INTO classi_documentali (uuid, nome, versione, valida_da, uuid_dip)
    VALUES (?, ?, ?, ?, ?)
  `).run(TEST_CLASS_UUID, 'Classe Test', TEST_CLASS_VERSION, '2024-01-01', TEST_DIP_UUID);

  db.prepare(`
    INSERT INTO processi_conservazione (uuid, data_creazione, dimensione_totale, numero_sip, numero_documenti, numero_file_documenti, uuid_classe_documentale, versione_classe_documentale)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(TEST_PROCESS_UUID, new Date().toISOString(), '2048 KB', 1, 2, 3, TEST_CLASS_UUID, TEST_CLASS_VERSION);

  const insertFile = db.prepare(`INSERT INTO files (uuid, percorso, dimensione) VALUES (?, ?, ?)`);
  insertFile.run(TEST_FILE_UUID, 'test/path/main_file_1.pdf', '512 KB');
  insertFile.run(TEST_FILE_UUID_2, 'test/path/main_file_2.pdf', '1024 KB');
  insertFile.run(TEST_FILE_ATTACHMENT_UUID, 'test/path/attachment_1.pdf', '256 KB');

  const insertDocumento = db.prepare(`
    INSERT INTO documenti (uuid, percorso, uuid_processo_conservazione, uuid_file_principale)
    VALUES (?, ?, ?, ?)
  `);
  insertDocumento.run(TEST_DOCUMENT_UUID, 'test/path/document_1', TEST_PROCESS_UUID, TEST_FILE_UUID);
  insertDocumento.run(TEST_DOCUMENT_UUID_2, 'test/path/document_2', TEST_PROCESS_UUID, TEST_FILE_UUID_2);

  db.prepare(`
    INSERT INTO allegati (uuid_documento, uuid_file)
    VALUES (?, ?)
  `).run(TEST_DOCUMENT_UUID_2, TEST_FILE_ATTACHMENT_UUID);

  db.close();
}

export function clearDatabase(dbPath: string): void {
  const db = new Database(dbPath);
  db.prepare(`DELETE FROM metadata`).run();
  db.prepare(`DELETE FROM allegati`).run();
  db.prepare(`DELETE FROM documenti`).run();
  db.prepare(`DELETE FROM processi_conservazione`).run();
  db.prepare(`DELETE FROM files`).run();
  db.prepare(`DELETE FROM classi_documentali`).run();
  db.prepare(`DELETE FROM archivi_dip`).run();
  db.close();
}