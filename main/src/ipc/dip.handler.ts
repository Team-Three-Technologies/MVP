import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { fail, ok, IpcResponse } from '../../../shared/ipc-response';
import { ZipImportDipUseCase } from '../use-cases/zip-import-dip.use-case'
import { AutoImportDipUseCase } from '../use-cases/auto-import-dip.use-case';
import type { ZipImportDipDTO } from '../../../shared/zip-import-dip.dto';

@injectable()
export class DipHandler {
  constructor(
    @inject(TOKENS.ZipImportDipUseCase)
    private readonly zipImportDipUseCase: ZipImportDipUseCase,
    @inject(TOKENS.AutoImportDipUseCase)
    private readonly autoImportDipUseCase: AutoImportDipUseCase
  ) { }

  public async zipImport(dto: ZipImportDipDTO): Promise<IpcResponse<void>> {
    try {
      await this.zipImportDipUseCase.execute(dto.dipPath);
      return ok(undefined);
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  public async autoImport(): Promise<IpcResponse<void>> {
    try {
      await this.autoImportDipUseCase.execute();
      return ok(undefined);
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}