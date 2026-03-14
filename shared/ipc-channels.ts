export const IPC_CHANNELS = {
  DOCUMENTS_LIST: 'documents:list',
  DOCUMENTS_SAVE: 'documents:save',
  DOCUMENTS_DELETE: 'documents:delete',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];