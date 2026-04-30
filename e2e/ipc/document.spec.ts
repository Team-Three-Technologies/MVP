import { test, expect, ElectronApplication, Page } from '@playwright/test';
import { startApp, stopApp } from '../helpers/electron.helper';
import { seedTestDatabase, clearTestDatabase } from '../helpers/db.helper';
import * as seed from '../fixtures/seed';

test.describe('IPC - document:metadata', () => {
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

  test('restituisce i dettagli del documento senza allegati', async () => {
    const response = await page.evaluate(async (documentUuid) => {
      return (window as any).electronAPI.document.details({ documentUuid });
    }, seed.TEST_DOCUMENT_UUID);
    
    expect(response.error).toBeNull();
    const result = response.data;

    expect(result).toMatchObject({
      uuid: seed.TEST_DOCUMENT_UUID,
      attachmentsCount: 0,
      attachments: []
    });
  });

  test('restituisce i dettagli del documento con allegati', async () => {
    const response = await page.evaluate(async (documentUuid) => {
      return (window as any).electronAPI.document.details({ documentUuid });
    }, seed.TEST_DOCUMENT_UUID_2);
    
    expect(response.error).toBeNull();
    const result = response.data;

    expect(result).toMatchObject({
      uuid: seed.TEST_DOCUMENT_UUID_2,
      attachmentsCount: 1,
      attachments: [
        {
          uuid: seed.TEST_FILE_ATTACHMENT_UUID,
        }
      ]
    });
  });

  test('ritorna errore se il documento non esiste', async () => {
    const response = await page.evaluate(async () => {
      return (window as any).electronAPI.document.details({ documentUuid: 'non-existent-uuid' });
    });
    
    expect(response.error).toContain('non-existent-uuid');
    expect(response.data).toBeNull();
  });
});