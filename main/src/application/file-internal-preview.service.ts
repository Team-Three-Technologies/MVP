import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { FileInternalPreviewUseCase } from './file-internal-preview.use-case';
import { FileInternalPreviewResponseDTO } from '../../../shared/response/file-internal-preview.response.dto';
import { DocumentRepository } from '../repositories/document.repository.interface';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

@injectable()
export class FileInternalPreviewService implements FileInternalPreviewUseCase {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository,
  ) {}

  public async execute(
    documentUuid: string,
    fileUuid: string | undefined,
  ): Promise<FileInternalPreviewResponseDTO> {
    const document = await this.documentRepository.findByUuid(documentUuid, false);
    if (!document) {
      throw new Error(`Non esiste un documento con questo UUID: ${documentUuid}`);
    }

    let fullPath: string = '';
    if (!fileUuid) {
      fullPath = path.join(document.getPath(), document.getMain().getPath());
    } else {
      const attachment = document.getAttachments().find((a) => a.getUuid() === fileUuid);
      if (!attachment) {
        throw new Error(
          `Non esiste un file con UUID: ${fileUuid} associato al documento con UUID: ${documentUuid}`,
        );
      }
      fullPath = path.join(document.getPath(), attachment.getPath());
    }

    const fileUrl = pathToFileURL(fullPath).href.replace('file://', 'localfile://');
    return { fileUrl };
  }
}
