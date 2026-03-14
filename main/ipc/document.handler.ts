import { ipcMain } from 'electron';
import { container } from 'tsyringe';
import { IPC_CHANNELS } from '../../shared/ipc-channels';
import { ok, fail } from '../../shared/ipc-response';
import { DocumentService } from '../domains/documents/document.service';

export function registerDocumentHandlers(): void {
  const service = container.resolve(DocumentService);

  ipcMain.handle(IPC_CHANNELS.DOCUMENTS_LIST, () => {
    try {
      return ok(service.findAll());
    } catch (e) {
      return fail((e as Error).message);
    }
  });

  ipcMain.handle(IPC_CHANNELS.DOCUMENTS_SAVE, (_, dto) => {
    try {
      return ok(service.save(dto));
    } catch (e) {
      return fail((e as Error).message);
    }
  });

  ipcMain.handle(IPC_CHANNELS.DOCUMENTS_DELETE, (_, id) => {
    try {
      service.delete(id);
      return ok(null);
    } catch (e) {
      return fail((e as Error).message);
    }
  });
}