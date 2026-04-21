import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { ExportFileUseCase } from './export-file.use-case';
import { ExportFileResponseDTO } from '../../../shared/response/export-file.response';
import { DocumentRepository } from '../repositories/document.repository.interface';
import { DialogProvider } from '../infrastructure/dialog/dialog.provider.interface';
import { FileSystemProvider } from '../infrastructure/fs/file-system.provider.interface';
import { File } from '../domain/file.model';
import path from 'path';

@injectable()
export class ExportFileService implements ExportFileUseCase {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository,
    @inject(TOKENS.DialogProvider)
    private readonly dialogProvider: DialogProvider,
    @inject(TOKENS.FileSystemProvider)
    private readonly fileSystemProvider: FileSystemProvider,
  ) {}

  public async execute(
    documentUuid: string,
    fileUuid: string | undefined,
  ): Promise<ExportFileResponseDTO> {
    const document = await this.documentRepository.findByUuid(documentUuid);
    if (!document) {
      throw new Error(`Non esiste un documento con questo UUID: ${documentUuid}`);
    }

    let file: File | null = null;
    let fullPath: string = '';
    if (!fileUuid) {
      file = document.getMain();
      fullPath = path.join(document.getPath(), document.getMain().getPath());
    } else {
      const attachment = document.getAttachments().find((a) => a.getUuid() === fileUuid);
      if (!attachment) {
        throw new Error(
          `Non esiste un file con UUID: ${fileUuid} associato al documento con UUID: ${documentUuid}`,
        );
      }
      file = attachment;
      fullPath = path.join(document.getPath(), attachment.getPath());
    }

    const savePath = await this.dialogProvider.selectSavePath(file.getPath());
    if (!savePath) {
      throw new Error('Selezione cancellata');
    }

    try {
      await this.fileSystemProvider.copyFile(fullPath, savePath);
    } catch (e) {
      throw new Error(`Esportazione file con UUID: ${file.getUuid()} a ${savePath} fallita`);
    }
    return { path: savePath };
  }
}
