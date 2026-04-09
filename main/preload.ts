import { contextBridge, ipcRenderer } from 'electron';

const IPC_CHANNELS = {
  DIP_AUTO_IMPORT: 'dip:auto-import',
}

contextBridge.exposeInMainWorld('electronAPI', {
  dip: {
    autoImport: () => ipcRenderer.invoke(IPC_CHANNELS.DIP_AUTO_IMPORT),
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});