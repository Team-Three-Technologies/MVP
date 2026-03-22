import 'reflect-metadata';
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { registerDependencies } from './src/infrastructure/container';
import { registerAllHandlers } from './src/ipc/router';
import { IPC_CHANNELS } from './ipc-channels';

app.whenReady().then(() => {
  registerDependencies();
  registerAllHandlers();
  createWindow();

  // TODO: da controllare se ci si trova all'interno di un Dip, come boh
  // path.dirname(process.execPath)
  ipcMain.emit(IPC_CHANNELS.DIP_AUTO_IMPORT, null);
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
    win.loadFile(
      path.join(app.getAppPath(), 'dist/renderer/browser/index.html')
    );
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});