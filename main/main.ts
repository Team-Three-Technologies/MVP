import 'reflect-metadata';
import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { registerDependencies } from './src/infrastructure/di/container';
import { registerAllHandlers } from './src/presentation/router';

app.whenReady().then(() => {
  registerDependencies();
  registerAllHandlers();
  createWindow();
});

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  const isDev = process.env['NODE_ENV'] === 'development';

  if (isDev) {
    win.loadURL('http://localhost:4200');
  } else {
    win.loadFile(path.join(app.getAppPath(), 'dist/renderer/browser/index.html'));
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});