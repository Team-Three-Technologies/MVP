import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { ok, fail, IpcResponse } from '../../../shared/ipc-response';
import type { OpenZipDialogUseCase } from '../use-cases/open-zip-dialog.use-case';

@injectable()
export class DialogHandler {
  constructor(
    @inject(TOKENS.OpenZipDialogUseCase)
    private readonly openZipDialogUseCase: OpenZipDialogUseCase
  ) { }

  public async openZipDialog(): Promise<IpcResponse<string | null>> {
    try {
      return ok(await this.openZipDialogUseCase.execute());
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}