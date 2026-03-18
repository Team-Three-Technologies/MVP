import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { ok, fail, IpcResponse } from '../../../shared/ipc-response';
import type { OpenDialogUseCase } from '../use-cases/open-dialog.use-case';

@injectable()
export class DialogHandler {
  constructor(
    @inject(TOKENS.OpenDialogUseCase)
    private readonly openDialogUseCase: OpenDialogUseCase
  ) { }

  async openDialog(): Promise<IpcResponse<string | null>> {
    try {
      return ok(await this.openDialogUseCase.execute());
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}