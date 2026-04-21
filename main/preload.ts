import { contextBridge, ipcRenderer } from 'electron';
import { DipRequestDTO } from '../shared/request/dip.request.dto';
import { DocumentRequestDTO } from '../shared/request/document.request.dto';
import { ExportFileRequestDTO } from '../shared/request/export-file.request.dto';

const IPC_CHANNELS = {
  DIP_AUTO_IMPORT: 'dip:auto-import',
  DIP_CONTENT: 'dip:content',
  DIP_CHECK_INTEGRITY: 'dip:check-integrity',
  DOCUMENT_DETAILS: 'document:details',
  DOCUMENT_EXPORT_FILE: 'document:export-file',
};

// definita API di comunicazione
contextBridge.exposeInMainWorld('electronAPI', {
  dip: { // invoca evento (si trova in ipc-channels.ts)
    autoImport: () => ipcRenderer.invoke(IPC_CHANNELS.DIP_AUTO_IMPORT),
    content: (dipRequestDto: DipRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DIP_CONTENT, dipRequestDto),
    checkIntegrity: (dipRequestDto: DipRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DIP_CHECK_INTEGRITY, dipRequestDto),
  },
  document: {
    details: (documentRequestDto: DocumentRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_DETAILS, documentRequestDto),
    exportFile: (exportFileRequestDto: ExportFileRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_EXPORT_FILE, exportFileRequestDto),
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});

// quando viene invocato l'evento, in src > presentation > router.ts
// viene definito che l'evento è gestito dalla funzione dipHandler.autoImport()