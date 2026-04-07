import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from './ipc-channels';

contextBridge.exposeInMainWorld('electronAPI', {
  dialog: {
  },
  dip: {
    autoImport: () => ipcRenderer.invoke(IPC_CHANNELS.DIP_AUTO_IMPORT),
    loadDocuments: () => ipcRenderer.invoke(IPC_CHANNELS.DIP_LOAD_DOCUMENTS),
    searchDocuments: (filters: unknown) => ipcRenderer.invoke(IPC_CHANNELS.DIP_SEARCH_DOCUMENTS, filters),
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});