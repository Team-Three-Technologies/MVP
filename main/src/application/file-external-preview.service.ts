import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { FileExternalPreviewUseCase } from './file-external-preview.use-case';
import { DocumentRepository } from '../repositories/document.repository.interface';
import { FileSystemProvider } from '../infrastructure/fs/file-system.provider.interface';
import { ShellProvider } from '../infrastructure/shell/shell.provider.interface';
import path from 'path';

@injectable()
export class FileExternalPreviewService implements FileExternalPreviewUseCase {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository,
    @inject(TOKENS.FileSystemProvider)
    private readonly fileSystemProvider: FileSystemProvider,
    @inject(TOKENS.ShellProvider)
    private readonly shellProvider: ShellProvider,
  ) {}

  public async execute(documentUuid: string, fileUuid: string | undefined): Promise<void> {
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

    const safePath =
      fullPath.length <= 260 ? fullPath : await this.fileSystemProvider.createTempFile(fullPath);
    await this.shellProvider.openFile(safePath);
  }
}
