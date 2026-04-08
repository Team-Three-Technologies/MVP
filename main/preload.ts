import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from './ipc-channels';
import {z} from 'zod';

const filterSchema = z.object({
  type: z.string(),
  value: z.string(),
});

contextBridge.exposeInMainWorld('electronAPI', {
  dialog: {
  },
  dip: {
    autoImport: () => ipcRenderer.invoke(IPC_CHANNELS.DIP_AUTO_IMPORT),
    loadDocuments: () => ipcRenderer.invoke(IPC_CHANNELS.DIP_LOAD_DOCUMENTS),
    searchDocuments: (filters: unknown) => {
      const parsedFilters = filterSchema.array().parse(filters);
      return ipcRenderer.invoke(IPC_CHANNELS.DIP_SEARCH_DOCUMENTS, parsedFilters);
    },
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});