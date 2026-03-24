import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from './ipc-channels';
import type { ZipImportDipDTO } from '../shared/zip-import-dip.dto';

contextBridge.exposeInMainWorld('electronAPI', {
  dialog: {
    openZip: () => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_ZIP),
  },
  dip: {
    autoImport: () => ipcRenderer.invoke(IPC_CHANNELS.DIP_AUTO_IMPORT),
    zipImport: (dto: ZipImportDipDTO) => ipcRenderer.invoke(IPC_CHANNELS.DIP_IMPORT, dto),
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});