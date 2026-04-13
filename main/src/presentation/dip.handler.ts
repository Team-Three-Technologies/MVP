import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { AutoImportDipUseCase } from '../application/auto-import-dip.use-case';
import { IpcResponse } from '../../../shared/ipc-response';
import { ok, fail } from './ipc-response.utils';
import { AutoImportDipResponseDTO } from '../../../shared/auto-import-dip.response.dto';

@injectable()
export class DipHandler {
  constructor(
    @inject(TOKENS.AutoImportDipUseCase)
    private readonly autoImportDipUseCase: AutoImportDipUseCase
  ) { }

  public async autoImport(): Promise<IpcResponse<AutoImportDipResponseDTO>> {
    try {
      const dipUuid = await this.autoImportDipUseCase.execute(); // cerca un dip index nella cartella in cui è stata avviata l'applicazione -> parsing dei dati -> caricati nel db -> visualizza contenuto cartella
      return ok({
        dipUuid: dipUuid
      } as AutoImportDipResponseDTO);
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}