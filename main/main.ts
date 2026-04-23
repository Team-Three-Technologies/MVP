import 'reflect-metadata';
import { app, BrowserWindow } from 'electron';
import * as path from 'node:path';
import { registerDependencies } from './src/infrastructure/di/container';
import { registerAllHandlers } from './src/presentation/router';
import { container } from 'tsyringe';
import { TOKENS } from './src/infrastructure/di/tokens';
import { DatabaseProvider } from './src/infrastructure/database/database.provider';

app.whenReady().then(async () => {
  registerDependencies();
  await container.resolve<DatabaseProvider>(TOKENS.DatabaseProvider).init();
  registerAllHandlers();
  createWindow();
});

// crea la finestra
function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), 
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  const isDev = process.env['NODE_ENV'] === 'development';

  if (isDev) {  // modalità dev
    win.loadURL('http://localhost:4200');
  } else {      // distribuzione
    win.loadFile(path.join(app.getAppPath(), 'dist/renderer/browser/index.html'));
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});