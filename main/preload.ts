import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../shared/ipc-channels';
import type { CreateDocumentDto } from '../shared/dto';

contextBridge.exposeInMainWorld('electronAPI', {
  documents: {
    list: () => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_LIST),
    save: (dto: CreateDocumentDto) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_SAVE, dto),
    delete: (id: string) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENTS_DELETE, id),
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});