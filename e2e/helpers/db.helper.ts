import { ElectronApplication } from '@playwright/test';
import * as path from 'path';
import * as seed from '../fixtures/seed';

// Percorsi assoluti per evitare ambiguità tra processi
export const DB_PATH = path.resolve('./e2e/test-user-data/documents/app.db');
const NODE_MODULES_PATH = path.resolve('./node_modules');

/**
 * Esegue il seed del database all'interno del processo Electron Main.
 * Questo evita conflitti di versioni di moduli nativi (better-sqlite3).
 */
export async function seedTestDatabase(app: ElectronApplication): Promise<void> {
  await app.evaluate(async (_, { dbPath, nodeModulesPath, constants }) => {
    // Utilizziamo il require del processo main di Electron
    const Database = (process as any).mainModule.require(nodeModulesPath + '/better-sqlite3');
    const db = new Database(dbPath);
    
    // 1. Inserimento dati (Schema reale 001_init.sql)
    db.prepare(`INSERT INTO archivi_dip (uuid_processo, data_creazione, numero_documenti, numero_aip) VALUES (?, ?, ?, ?)`).run(
      constants.TEST_DIP_UUID, new Date().toISOString(), 2, 1
    );

    db.prepare(`INSERT INTO classi_documentali (uuid, nome, versione, valida_da, uuid_dip) VALUES (?, ?, ?, ?, ?)`).run(
      constants.TEST_CLASS_UUID, 'Classe Test', constants.TEST_CLASS_VERSION, '2024-01-01', constants.TEST_DIP_UUID
    );

    db.prepare(`INSERT INTO processi_conservazione (uuid, data_creazione, dimensione_totale, numero_sip, numero_documenti, numero_file_documenti, uuid_classe_documentale, versione_classe_documentale) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      constants.TEST_PROCESS_UUID, new Date().toISOString(), '2048 KB', 1, 2, 3, constants.TEST_CLASS_UUID, constants.TEST_CLASS_VERSION
    );

    const insertFile = db.prepare(`INSERT INTO files (uuid, percorso, dimensione) VALUES (?, ?, ?)`);
    insertFile.run(constants.TEST_FILE_UUID, 'test/path/main_file_1.pdf', '512 KB');
    insertFile.run(constants.TEST_FILE_UUID_2, 'test/path/main_file_2.pdf', '1024 KB');
    insertFile.run(constants.TEST_FILE_ATTACHMENT_UUID, 'test/path/attachment_1.pdf', '256 KB');

    const insertDoc = db.prepare(`INSERT INTO documenti (uuid, percorso, uuid_processo_conservazione, uuid_file_principale) VALUES (?, ?, ?, ?)`);
    insertDoc.run(constants.TEST_DOCUMENT_UUID, 'test/path/document_1', constants.TEST_PROCESS_UUID, constants.TEST_FILE_UUID);
    insertDoc.run(constants.TEST_DOCUMENT_UUID_2, 'test/path/document_2', constants.TEST_PROCESS_UUID, constants.TEST_FILE_UUID_2);

    db.prepare(`INSERT INTO allegati (uuid_documento, uuid_file) VALUES (?, ?)`).run(
      constants.TEST_DOCUMENT_UUID_2, constants.TEST_FILE_ATTACHMENT_UUID
    );

    db.prepare(`INSERT INTO metadata (nome, valore, tipo, uuid_documento) VALUES (?, ?, ?, ?)`).run(
      'Test.ChiaveDescrittiva.Oggetto', 'Oggetto di test', 'string', constants.TEST_DOCUMENT_UUID
    );

    db.close();
  }, { 
    dbPath: DB_PATH,
    nodeModulesPath: NODE_MODULES_PATH,
    constants: {
      TEST_DIP_UUID: seed.TEST_DIP_UUID,
      TEST_CLASS_UUID: seed.TEST_CLASS_UUID,
      TEST_CLASS_VERSION: seed.TEST_CLASS_VERSION,
      TEST_PROCESS_UUID: seed.TEST_PROCESS_UUID,
      TEST_FILE_UUID: seed.TEST_FILE_UUID,
      TEST_FILE_UUID_2: seed.TEST_FILE_UUID_2,
      TEST_FILE_ATTACHMENT_UUID: seed.TEST_FILE_ATTACHMENT_UUID,
      TEST_DOCUMENT_UUID: seed.TEST_DOCUMENT_UUID,
      TEST_DOCUMENT_UUID_2: seed.TEST_DOCUMENT_UUID_2
    }
  });
}

/**
 * Pulisce tutte le tabelle del database all'interno del processo Electron Main.
 */
export async function clearTestDatabase(app: ElectronApplication): Promise<void> {
  await app.evaluate(async (_, { dbPath, nodeModulesPath }) => {
    const Database = (process as any).mainModule.require(nodeModulesPath + '/better-sqlite3');
    const db = new Database(dbPath);
    const tables = ['metadata', 'allegati', 'documenti', 'processi_conservazione', 'files', 'classi_documentali', 'archivi_dip'];
    for (const table of tables) {
      try { db.prepare(`DELETE FROM ${table}`).run(); } catch (e) {}
    }
    db.close();
  }, { dbPath: DB_PATH, nodeModulesPath: NODE_MODULES_PATH });
}
