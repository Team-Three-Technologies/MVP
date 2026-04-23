export const IPC_CHANNELS = {
  DIP_AUTO_IMPORT: 'dip:auto-import',
  DIP_CONTENT: 'dip:content',
  DIP_CHECK_INTEGRITY: 'dip:check-integrity',
  DOCUMENT_DETAILS: 'document:details',
  DOCUMENT_EXPORT_FILE: 'document:export-file',
  DOCUMENT_FILE_INTERNAL_PREVIEW: 'document:file-internal-preview',
  DOCUMENT_FILE_EXTERNAL_PREVIEW: 'document:file-external-preview',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];