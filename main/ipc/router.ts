import { container } from 'tsyringe';
import { ipcMain } from 'electron';
import { IPC_CHANNELS } from '../../shared/ipc-channels';
import { DocumentHandler } from './document.handler';

export function registerAllHandlers(): void {
  const documentHandler = container.resolve(DocumentHandler);

  ipcMain.handle(IPC_CHANNELS.DOCUMENTS_LIST, () => documentHandler.list());
  ipcMain.handle(IPC_CHANNELS.DOCUMENTS_SAVE, (_, dto) => documentHandler.save(dto));
  ipcMain.handle(IPC_CHANNELS.DOCUMENTS_DELETE, (_, id) => documentHandler.delete(id));
}