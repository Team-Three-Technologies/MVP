import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { AutoImportDipUseCase } from '../application/auto-import-dip.use-case';
import { GetDipContentUseCase } from '../application/get-dip-content.use-case';
import { AutoImportDipResponseDTO } from '../../../shared/response/auto-import-dip.response.dto';
import { DipRequestDTO } from '../../../shared/request/dip.request.dto';
import { DipContentResponseDTO } from '../../../shared/response/dip-details.response.dto';
import { IpcResponse } from '../../../shared/ipc-response';
import { ok, fail } from './ipc-response.utils';

@injectable()
export class DipHandler {
  constructor(
    @inject(TOKENS.AutoImportDipUseCase)
    private readonly autoImportDipUseCase: AutoImportDipUseCase,
    @inject(TOKENS.GetDipContentUseCase)
    private readonly getDipContentUseCase: GetDipContentUseCase,
  ) {}

  public async autoImport(): Promise<IpcResponse<AutoImportDipResponseDTO>> {
    try {
      return ok(await this.autoImportDipUseCase.execute()); // cerca un dip index nella cartella in cui è stata avviata l'applicazione -> parsing dei dati -> caricati nel db -> visualizza contenuto cartella
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  public async getDipContent(
    dipRequestDto: DipRequestDTO,
  ): Promise<IpcResponse<DipContentResponseDTO>> {
    try {
      const response = await this.getDipContentUseCase.execute(dipRequestDto.dipUuid);
      console.log(response);
      return ok(response);
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}
