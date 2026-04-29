import { test, expect, ElectronApplication, Page } from '@playwright/test';
import { startApp, stopApp } from '../helpers/electron.helper';
import { seedTestDatabase, clearTestDatabase } from '../helpers/db.helper';
import * as fs from 'fs';
import * as path from 'path';

test.describe('IPC - autoImport:import', () => {
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

test('ritorna errore se il DiPIndex non viene trovato nella cartella', async () => {
  const folderPath = path.resolve('./e2e/fixtures/dip-sample');
  const files = fs.readdirSync(folderPath);
  const dipIndexFile = files.find(f => f.startsWith('DiPIndex'));

  if (dipIndexFile) {
    fs.renameSync(path.join(folderPath, dipIndexFile), path.join(folderPath, dipIndexFile + '.bak'));
  }
  const response = await page.evaluate(() => (window as any).electronAPI.dip.autoImport());

  if (dipIndexFile) {
    fs.renameSync(path.join(folderPath, dipIndexFile + '.bak'), path.join(folderPath, dipIndexFile));
  }
  expect(response.error).toContain('mancante');
  expect(response.data).toBeNull();
});


  test('restituisce il contenuto del DIP con i documenti corretti', async () => {
    const response = await page.evaluate(() => {
        return (window as any).electronAPI.dip.autoImport();
    });
    
    expect(response.error).toBeNull();
    expect(response.data.dipUuid).toBeDefined();
    expect(typeof response.data.dipUuid).toBe('string');
  });

    test('ritorna errore se il DIP è già stato importato', async () => {
    await page.evaluate(() => (window as any).electronAPI.dip.autoImport());

    const response = await page.evaluate(() => {
      return (window as any).electronAPI.dip.autoImport();
    });

    expect(response.data).toBeNull();
    expect(response.error).toBeDefined();
    expect(response.error).toContain('già importato');
  });

});