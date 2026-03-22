export const IPC_CHANNELS = {
  DIALOG_OPEN_ZIP: 'dialog:open-zip',
  DIP_AUTO_IMPORT: 'dip:auto-import',
  DIP_IMPORT: 'dip:import',
} as const;

export type IpcChannel = typeof IPC_CHANNELS[keyof typeof IPC_CHANNELS];