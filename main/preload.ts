import { contextBridge, ipcRenderer } from 'electron';
import { DipRequestDTO } from '../shared/request/dip.request.dto';
import { DocumentRequestDTO } from '../shared/request/document.request.dto';
import { FileRequestDTO } from '../shared/request/file.request.dto';
import { SearchRequestDTO } from '../shared/request/search.request.dto';
import { pathToFileURL } from 'node:url';

const IPC_CHANNELS = {
  DIP_AUTO_IMPORT: 'dip:auto-import',
  DIP_CONTENT: 'dip:content',
  DIP_CHECK_INTEGRITY: 'dip:check-integrity',
  DOCUMENT_DETAILS: 'document:details',
  DOCUMENT_METADATA_SEARCH: 'document:metadata-search',
  DOCUMENT_FILE_INTERNAL_PREVIEW: 'document:file-internal-preview',
  DOCUMENT_FILE_EXTERNAL_PREVIEW: 'document:file-external-preview',
  DOCUMENT_EXPORT_FILE: 'document:export-file',
};

// definita API di comunicazione
contextBridge.exposeInMainWorld('electronAPI', {
  toLocalFileUrl: (filePath: string) =>
    pathToFileURL(filePath).href.replace('file://', 'localfile://'),
  dip: { // invoca evento (si trova in ipc-channels.ts)
    autoImport: () => ipcRenderer.invoke(IPC_CHANNELS.DIP_AUTO_IMPORT),
    content: (dipRequestDto: DipRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DIP_CONTENT, dipRequestDto),
    checkIntegrity: (dipRequestDto: DipRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DIP_CHECK_INTEGRITY, dipRequestDto),
  },
  document: {
    details: (documentRequestDto: DocumentRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_DETAILS, documentRequestDto),
    searchDocuments: (searchRequestDto: SearchRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_METADATA_SEARCH, searchRequestDto),
    fileInternalPreview: (fileRequestDto: FileRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_FILE_INTERNAL_PREVIEW, fileRequestDto),
    fileExternalPreview: (fileRequestDto: FileRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_FILE_EXTERNAL_PREVIEW, fileRequestDto),
    exportFile: (fileRequestDto: FileRequestDTO) => ipcRenderer.invoke(IPC_CHANNELS.DOCUMENT_EXPORT_FILE, fileRequestDto),
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});

// quando viene invocato l'evento, in src > presentation > router.ts
// viene definito che l'evento è gestito dalla funzione dipHandler.autoImport()
