import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',        // dove cercare i file di test
  timeout: 60000,          // timeout generoso per Electron
  reporter: 'list',        // output leggibile nel terminale
  workers: 1, 
  projects: [
    {
      name: 'electron',
      use: {
        // qui va la configurazione per Electron
      }
    }
  ]
});