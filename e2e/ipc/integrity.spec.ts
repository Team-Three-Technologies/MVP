import { test, expect, ElectronApplication, Page } from '@playwright/test';
import { startApp, stopApp } from '../helpers/electron.helper';
import { seedTestDatabase, clearTestDatabase } from '../helpers/db.helper';
import * as seed from '../fixtures/seed';

test.describe('IPC - dip:check-integrity', () => {
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

  test('emette un risultato per ogni documento e completa', async () => {
    // Eseguiamo il test nel browser context per ascoltare gli eventi IPC (via preload)
    const resultData = await page.evaluate(async (dipUuid) => {
      const results: any[] = [];
      
      return new Promise((resolve, reject) => {
        // Registriamo i listener per i risultati intermedi e la fine del processo
        const removeResultListener = (window as any).electronAPI.on('dip:integrity-result', (res: any) => {
          results.push(res);
        });

        const removeDoneListener = (window as any).electronAPI.on('dip:integrity-done', () => {
          removeResultListener();
          removeDoneListener();
          resolve({ results, isDone: true });
        });

        const removeErrorListener = (window as any).electronAPI.on('dip:integrity-error', (err: any) => {
          removeResultListener();
          removeDoneListener();
          removeErrorListener();
          reject(err);
        });

        // Avviamo il processo di controllo integrità
        (window as any).electronAPI.dip.checkIntegrity({ dipUuid });

        // Timeout di sicurezza
        setTimeout(() => {
          removeResultListener();
          removeDoneListener();
          reject(new Error('Timeout waiting for integrity-done'));
        }, 10000);
      });
    }, seed.TEST_DIP_UUID) as { results: any[], isDone: boolean };

    // Verifiche finali
    expect(resultData.isDone).toBe(true);
    expect(resultData.results.length).toBeGreaterThan(0);

    // Verifichiamo la struttura del primo risultato ricevuto
    const firstResult = resultData.results[0];
    expect(firstResult.error).toBeNull();
    expect(firstResult.data.integrity).toBeDefined();
    expect(firstResult.data.integrity.uuid).toBeDefined();
  });

 test('completa senza risultati se il DIP non esiste', async () => {
  const resultData = await page.evaluate(() => {
    return new Promise((resolve) => {
      const results: any[] = [];

      const unsubResult = (window as any).electronAPI.on('dip:integrity-result', (res: any) => {
        results.push(res);
      });

      (window as any).electronAPI.on('dip:integrity-done', () => {
        unsubResult();
        resolve({ results, isDone: true });
      });

      (window as any).electronAPI.dip.checkIntegrity({ dipUuid: 'non-existent-uuid' });
    });
  });

  const data = resultData as { results: any[], isDone: boolean };
  expect(data.isDone).toBe(true);
  expect(data.results.length).toBe(0);  // nessun documento trovato

});
});