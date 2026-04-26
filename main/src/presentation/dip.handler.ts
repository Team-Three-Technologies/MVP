import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { IpcMainEvent } from 'electron';
import { IPC_CHANNELS } from '../../../shared/ipc-channels';
import { AutoImportDipUseCase } from '../application/auto-import-dip.use-case';
import { GetDipContentUseCase } from '../application/get-dip-content.use-case';
import { CheckDipIntegrityUseCase } from '../application/check-dip-integrity.use-case';
import { AutoImportDipResponseDTO } from '../../../shared/response/auto-import-dip.response.dto';
import { DipRequestDTO } from '../../../shared/request/dip.request.dto';
import { DipContentResponseDTO } from '../../../shared/response/dip-content.response.dto';
import { IpcResponse } from '../../../shared/ipc-response';
import { ok, fail } from './ipc-response.utils';

@injectable()
export class DipHandler {
  constructor(
    @inject(TOKENS.AutoImportDipUseCase)
    private readonly autoImportDipUseCase: AutoImportDipUseCase,
    @inject(TOKENS.GetDipContentUseCase)
    private readonly getDipContentUseCase: GetDipContentUseCase,
    @inject(TOKENS.CheckDipIntegrityUseCase)
    private readonly checkDipIntegrityUseCase: CheckDipIntegrityUseCase,
  ) {}

  public async autoImport(): Promise<IpcResponse<AutoImportDipResponseDTO>> {
    try {
      const response = await this.autoImportDipUseCase.execute();
      return ok(response); // cerca un dip index nella cartella in cui è stata avviata l'applicazione -> parsing dei dati -> caricati nel db -> visualizza contenuto cartella
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  public async getDipContent(
    dipRequestDto: DipRequestDTO,
  ): Promise<IpcResponse<DipContentResponseDTO>> {
    try {
      const response = await this.getDipContentUseCase.execute(dipRequestDto.dipUuid);
      return ok(response);
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  public async checkDipIntegrity(event: IpcMainEvent, dipRequestDto: DipRequestDTO): Promise<void> {
    try {
      for await (const result of this.checkDipIntegrityUseCase.execute(dipRequestDto.dipUuid)) {
        event.sender.send(IPC_CHANNELS.DIP_CHECK_INTEGRITY_RESULT, ok(result));
      }
      event.sender.send(IPC_CHANNELS.DIP_CHECK_INTEGRITY_DONE);
    } catch (e) {
      event.sender.send(IPC_CHANNELS.DIP_CHECK_INTEGRITY_ERROR, fail((e as Error).message));
    }
  }
}
