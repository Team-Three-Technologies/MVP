import { injectable, inject } from 'tsyringe';
import { ipcMain } from 'electron';
import { TOKENS } from '../infrastructure/tokens';
import { IPC_CHANNELS } from '../../shared/ipc-channels';
import { ok, fail } from '../../shared/ipc-response';
import type { DocumentUseCase } from '../use-cases/document.use-case';

@injectable()
export class DocumentHandler {
  constructor(
    @inject(TOKENS.DocumentUseCase)
    private readonly useCase: DocumentUseCase
  ) { }

  register(): void {
    ipcMain.handle(IPC_CHANNELS.DOCUMENTS_LIST, () => {
      try {
        return ok(this.useCase.findAll());
      } catch (e) {
        return fail((e as Error).message);
      }
    });

    ipcMain.handle(IPC_CHANNELS.DOCUMENTS_SAVE, (_, dto) => {
      try {
        return ok(this.useCase.save(dto));
      } catch (e) {
        return fail((e as Error).message);
      }
    });

    ipcMain.handle(IPC_CHANNELS.DOCUMENTS_DELETE, (_, id) => {
      try {
        this.useCase.delete(id);
        return ok(null);
      } catch (e) {
        return fail((e as Error).message);
      }
    });
  }
}