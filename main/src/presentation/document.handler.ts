import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { IpcResponse } from '../../../shared/ipc-response';
import { ok, fail } from './ipc-response.utils';
import { GetDocumentDetailsUseCase } from '../application/get-document-details.use-case';
import { ExportFileUseCase } from '../application/export-file.use-case';
import { FileInternalPreviewUseCase } from '../application/file-internal-preview.use-case';
import { FileExternalPreviewUseCase } from '../application/file-external-preview.use-case';
import { DocumentRequestDTO } from '../../../shared/request/document.request.dto';
import { DocumentDetailsResponseDTO } from '../../../shared/response/document-details.response.dto';
import { FileRequestDTO } from '../../../shared/request/file.request.dto';
import { ExportFileResponseDTO } from '../../../shared/response/export-file.response';
import { FileInternalPreviewResponseDTO } from '../../../shared/response/file-internal-preview.response.dto';

@injectable()
export class DocumentHandler {
  constructor(
    @inject(TOKENS.GetDocumentDetailsUseCase)
    private readonly getDocumentDetailsUseCase: GetDocumentDetailsUseCase,
    @inject(TOKENS.ExportFileUseCase)
    private readonly exportFileUseCase: ExportFileUseCase,
    @inject(TOKENS.FileInternalPreviewUseCase)
    private readonly fileInternalPreviewUseCase: FileInternalPreviewUseCase,
    @inject(TOKENS.FileExternalPreviewUseCase)
    private readonly fileExternalPreviewUseCase: FileExternalPreviewUseCase,
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
    fileRequestDto: FileRequestDTO,
  ): Promise<IpcResponse<ExportFileResponseDTO>> {
    try {
      const response = await this.exportFileUseCase.execute(
        fileRequestDto.documentUuid,
        fileRequestDto.fileUuid,
      );
      return ok(response);
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  public async fileInternalPreview(
    fileRequestDto: FileRequestDTO,
  ): Promise<IpcResponse<FileInternalPreviewResponseDTO>> {
    try {
      const response = await this.fileInternalPreviewUseCase.execute(
        fileRequestDto.documentUuid,
        fileRequestDto.fileUuid,
      );
      return ok(response);
    } catch (e) {
      return fail((e as Error).message);
    }
  }

  public async fileExternalPreview(fileRequestDto: FileRequestDTO): Promise<IpcResponse<void>> {
    try {
      const response = await this.fileExternalPreviewUseCase.execute(
        fileRequestDto.documentUuid,
        fileRequestDto.fileUuid,
      );
      return ok(response);
    } catch (e) {
      return fail((e as Error).message);
    }
  }
}
