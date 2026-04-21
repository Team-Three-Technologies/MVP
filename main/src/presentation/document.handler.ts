import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { IpcResponse } from '../../../shared/ipc-response';
import { ok, fail } from './ipc-response.utils';
import { GetDocumentDetailsUseCase } from '../application/get-document-details.use-case';
import { ExportFileUseCase } from '../application/export-file.use-case';
import { DocumentRequestDTO } from '../../../shared/request/document.request.dto';
import { DocumentDetailsResponseDTO } from '../../../shared/response/document-details.response.dto';
import { ExportFileRequestDTO } from '../../../shared/request/export-file.request.dto';
import { ExportFileResponseDTO } from '../../../shared/response/export-file.response';

@injectable()
export class DocumentHandler {
  constructor(
    @inject(TOKENS.GetDocumentDetailsUseCase)
    private readonly getDocumentDetailsUseCase: GetDocumentDetailsUseCase,
    @inject(TOKENS.ExportFileUseCase)
    private readonly exportFileUseCase: ExportFileUseCase,
  ) {}

  public async getDocumentDetails(
    documentRequestDto: DocumentRequestDTO,
  ): Promise<IpcResponse<DocumentDetailsResponseDTO>> {
    try {
      const response = await this.getDocumentDetailsUseCase.execute(
        documentRequestDto.documentUuid,
      );
      return ok(response);
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  public async exportFile(
    exportFileRequestDto: ExportFileRequestDTO,
  ): Promise<IpcResponse<ExportFileResponseDTO>> {
    try {
      const response = await this.exportFileUseCase.execute(
        exportFileRequestDto.documentUuid,
        exportFileRequestDto.fileUuid,
      );
      return ok(response);
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}
