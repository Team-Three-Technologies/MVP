import { container } from 'tsyringe';
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../ipc-channels';
import { DialogHandler } from './dialog.handler';
import { DipHandler } from './dip.handler';

export function registerAllHandlers(): void {
  const dialogHandler = container.resolve(DialogHandler);
  const dipHandler = container.resolve(DipHandler);

  ipcMain.handle(IPC_CHANNELS.DIALOG_OPEN_ZIP, () => dialogHandler.openZipDialog());

  ipcMain.handle(IPC_CHANNELS.DIP_IMPORT, (_, dto) => dipHandler.zipImport(dto));
  ipcMain.handle(IPC_CHANNELS.DIP_AUTO_IMPORT, () => dipHandler.autoImport());
}