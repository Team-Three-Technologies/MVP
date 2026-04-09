import { contextBridge, ipcRenderer } from 'electron';

const IPC_CHANNELS = {
  DIP_AUTO_IMPORT: 'dip:auto-import',
}

// definita API di comunicazione
contextBridge.exposeInMainWorld('electronAPI', {
  dip: { // invoca evento (si trova in ipc-channels.ts)
    autoImport: () => ipcRenderer.invoke(IPC_CHANNELS.DIP_AUTO_IMPORT),
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
    return () => ipcRenderer.removeAllListeners(channel);
  },
});

// quando viene invocato l'evento, in src > presentation > router.ts
// viene definito che l'evento è gestito dalla funzione dipHandler.autoImport()