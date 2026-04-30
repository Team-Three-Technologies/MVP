import { test, expect, ElectronApplication, Page } from '@playwright/test';
import { startApp, stopApp } from '../helpers/electron.helper';
import { seedTestDatabase, clearTestDatabase } from '../helpers/db.helper';
import * as seed from '../fixtures/seed';

test.describe('IPC - search:metadata', () => {
  let app: ElectronApplication;
  let page: Page;

  test.beforeEach(async () => {
    // 1. avvia app
    const result = await startApp();
    app = result.app;
    page = result.page;

    // 2. esegui seed nel main process
    await seedTestDatabase(app);
  });

  test.afterEach(async () => {
    if (app) {
      // 1. pulizia nel main process
      await clearTestDatabase(app);
      // 2. chiusura app
      await stopApp(app);
    }
  });

  test('restituisce la struttura base del documento cercato (test minimale)', async () => {
    const response = await page.evaluate(async () => {
      return (window as any).electronAPI.document.searchDocuments({
        filters: [{ type: 'Oggetto', value: 'test' }] 
      });
    });
    
    expect(response.error).toBeNull();
    const results = response.data.results;
    
    expect(results.length).toBeGreaterThan(0);
    const doc = results[0];
    expect(doc.documentUuid).toBe(seed.TEST_DOCUMENT_UUID);
    expect(doc.documentName).toBeDefined();
    expect(Array.isArray(doc.documentAttachments)).toBe(true);
  });

  test('restituisce un array vuoto se non ci sono risultati', async () => {
    const response = await page.evaluate(() => {
      return (window as any).electronAPI.document.searchDocuments({
        filters: [{ type: 'Oggetto', value: 'ValoreInesistente' }]
      });
    });
    
    expect(response.error).toBeNull();
    const results = response.data.results;
    expect(Array.isArray(results)).toBe(true);
    expect(results.length).toBe(0);
  });
});