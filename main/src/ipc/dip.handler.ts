import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { fail, ok, IpcResponse } from '../../../shared/ipc-response';
import { ImportDipUseCase } from '../use-cases/import-dip.use-case'
import { AutoImportDipUseCase } from '../use-cases/auto-import-dip.use-case';
import type { ImportDipDTO } from '../../../shared/import-dip.dto';

@injectable()
export class DipHandler {
  constructor(
    @inject(TOKENS.ImportDipUseCase)
    private readonly importDipUseCase: ImportDipUseCase,
    @inject(TOKENS.AutoImportDipUseCase)
    private readonly autoImportDipUseCase: AutoImportDipUseCase
  ) { }

  async import(dto: ImportDipDTO): Promise<IpcResponse<void>> {
    try {
      await this.importDipUseCase.execute(dto.dipPath);
      return ok(undefined);
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  async autoImport(): Promise<IpcResponse<void>> {
    try {
      await this.autoImportDipUseCase.execute();
      return ok(undefined);
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}