import { container } from 'tsyringe';
import { ipcMain } from 'electron';
import { DipHandler } from './dip.handler';
import { IPC_CHANNELS } from '../../ipc-channels';

export function registerAllHandlers(): void {
  const dipHandler = container.resolve(DipHandler);

  ipcMain.handle(IPC_CHANNELS.DIP_AUTO_IMPORT, () => dipHandler.autoImport());
}