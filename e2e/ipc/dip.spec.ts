import { test, expect, ElectronApplication, Page } from '@playwright/test';
import { startApp, stopApp } from '../helpers/electron.helper';
import { seedTestDatabase, clearTestDatabase } from '../helpers/db.helper';
import * as seed from '../fixtures/seed';

test.describe('IPC - dip:content', () => {
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

  test('restituisce il contenuto del DIP con i documenti corretti', async () => {
    const response = await page.evaluate((dipUuid) => {
      return (window as any).electronAPI.dip.content({ dipUuid });
    }, seed.TEST_DIP_UUID);

    expect(response.error).toBeNull();
    const result = response.data;

    expect(result.uuid).toBe(seed.TEST_DIP_UUID);
    expect(result.documentsList.length).toBe(2);

    const doc1 = result.documentsList.find((d: any) => d.documentUuid === seed.TEST_DOCUMENT_UUID);
    const doc2 = result.documentsList.find((d: any) => d.documentUuid === seed.TEST_DOCUMENT_UUID_2);

    expect(doc1).toBeDefined();
    expect(doc2).toBeDefined();
    expect(doc2.documentAttachments.length).toBe(1);
  });

  test('ritorna errore se il DIP non esiste', async () => {
    const response = await page.evaluate(() => {
      return (window as any).electronAPI.dip.content({ dipUuid: 'non-existent-uuid' });
    });

    expect(response.data).toBeNull();
    expect(response.error).toBeDefined();
  });
});