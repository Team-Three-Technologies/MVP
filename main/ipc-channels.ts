export const IPC_CHANNELS = {
  DIP_AUTO_IMPORT: 'dip:auto-import',
  DIP_LOAD_DOCUMENTS: 'dip:load-documents',
  DIP_SEARCH_DOCUMENTS: 'dip:search-documents',
  DIP_LOAD_DOCUMENT_FILE: 'dip:load-document-file',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];