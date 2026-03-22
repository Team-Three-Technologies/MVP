import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from './ipc-channels';
import type { ImportDipDTO } from '../shared/import-dip.dto';

contextBridge.exposeInMainWorld('electronAPI', {
  dialog: {
    openZip: () => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_ZIP),
  },
  dip: {
    import: (dto: ImportDipDTO) => ipcRenderer.invoke(IPC_CHANNELS.DIP_IMPORT, dto),
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});