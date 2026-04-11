import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { fail, ok, IpcResponse } from '../../../shared/ipc-response';
import { AutoImportDipUseCase } from '../use-cases/auto-import-dip.use-case';
import * as fs from 'fs/promises';

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
  public async loadDocumentFile(filePath: string): Promise<number[]> {
    const file = await fs.readFile(filePath);
    return Array.from(file);
  }
}