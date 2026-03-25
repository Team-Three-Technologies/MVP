import { container } from 'tsyringe';
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../ipc-channels';
import { DipHandler } from './dip.handler';

export function registerAllHandlers(): void {
  const dipHandler = container.resolve(DipHandler);

  ipcMain.handle(IPC_CHANNELS.DIP_AUTO_IMPORT, () => dipHandler.autoImport());
}