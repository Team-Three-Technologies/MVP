import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { AutoImportDipUseCase } from '../application/auto-import-dip.use-case';
import { IpcResponse } from '../../../shared/ipc-response';
import { ok, fail } from './ipc-response.utils';

@injectable()
export class DipHandler {
  constructor(
    @inject(TOKENS.AutoImportDipUseCase)
    private readonly autoImportDipUseCase: AutoImportDipUseCase
  ) { }

  public async autoImport(): Promise<IpcResponse<void>> {
    try {
      await this.autoImportDipUseCase.execute();
      return ok(undefined);
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}