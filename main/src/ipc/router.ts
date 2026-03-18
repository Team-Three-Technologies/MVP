import { container } from 'tsyringe';
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { DialogHandler } from './dialog.handler';
import { DiPHandler } from './dip.handler';

export function registerAllHandlers(): void {
  const dialogHandler = container.resolve(DialogHandler);
  const dipHandler = container.resolve(DiPHandler);

  ipcMain.handle(IPC_CHANNELS.DIALOG_OPEN_ZIP, () => dialogHandler.openDialog());

  ipcMain.handle(IPC_CHANNELS.DIP_IMPORT, (_, dto) => dipHandler.import(dto));
  ipcMain.on(IPC_CHANNELS.DIP_AUTO_IMPORT, () => dipHandler.autoImport());
}