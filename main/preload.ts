import { contextBridge, ipcRenderer } from 'electron';
import { DipRequestDTO } from '../shared/request/dip.request.dto';
import { DocumentRequestDTO } from '../shared/request/document.request.dto';

const IPC_CHANNELS = {
  DIP_AUTO_IMPORT: 'dip:auto-import',
  DIP_CONTENT: 'dip:content',
  DOCUMENT_DETAILS: 'document:details',
};

// definita API di comunicazione
contextBridge.exposeInMainWorld('electronAPI', {
  dip: { // invoca evento (si trova in ipc-channels.ts)
    autoImport: () => ipcRenderer.invoke(IPC_CHANNELS.DIP_AUTO_IMPORT),
    content: (dipRequestDto: DipRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DIP_CONTENT, dipRequestDto),
  },
  document: {
    details: (documentRequestDto: DocumentRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_DETAILS, documentRequestDto),
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});

// quando viene invocato l'evento, in src > presentation > router.ts
// viene definito che l'evento è gestito dalla funzione dipHandler.autoImport()