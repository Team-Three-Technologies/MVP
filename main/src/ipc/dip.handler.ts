import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { fail, ok, IpcResponse } from '../../../shared/ipc-response';
import { ImportDiPUseCase } from '../use-cases/import-dip.use-case'
import { AutoImportDiPUseCase } from '../use-cases/auto-import-dip.use-case';
import type { ImportDiPDTO } from '../../../shared/import-dip.dto';

@injectable()
export class DiPHandler {
  constructor(
    @inject(TOKENS.ImportDiPUseCase)
    private readonly importDiPUseCase: ImportDiPUseCase,
    @inject(TOKENS.AutoImportDiPUseCase)
    private readonly autoImportDiPUseCase: AutoImportDiPUseCase
  ) { }

  async import(dto: ImportDiPDTO): Promise<IpcResponse<void>> {
    try {
      await this.importDiPUseCase.execute(dto.dipPath);
      return ok(undefined);
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  async autoImport(): Promise<IpcResponse<void>> {
    try {
      await this.autoImportDiPUseCase.execute();
      return ok(undefined);
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}