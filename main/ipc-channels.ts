export const IPC_CHANNELS = {
  DIP_AUTO_IMPORT: 'dip:auto-import',
  DIP_CONTENT: 'dip:content',
  DIP_CHECK_INTEGRITY: 'dip:check-integrity',
  DOCUMENT_DETAILS: 'document:details',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];