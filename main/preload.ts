import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/ipc-channels';
import type { ImportDiPDTO } from '../shared/import-dip.dto';

contextBridge.exposeInMainWorld('electronAPI', {
  dialog: {
    openZipDialog: () => ipcRenderer.invoke(IPC_CHANNELS.DIALOG_OPEN_ZIP),
  },
  dip: {
    import: (dto: ImportDiPDTO) => ipcRenderer.invoke(IPC_CHANNELS.DIP_IMPORT, dto),
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});