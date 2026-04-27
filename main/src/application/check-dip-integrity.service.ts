import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { CheckDipIntegrityUseCase } from './check-dip-integrity.use-case';
import { DocumentIntegrityResponseDTO } from '../../../shared/response/document-integrity.response.dto';
import { DocumentRepository } from '../repositories/document.repository.interface';
import { Document } from '../domain/document.model';
import { File } from '../domain/file.model';
import { FileSystemProvider } from '../infrastructure/fs/file-system.provider.interface';
import { Base64Provider } from '../infrastructure/base64/base64.provider.interface';
import { HashProvider } from '../infrastructure/hash/hash.provider.interface';
import * as path from 'node:path';

@injectable()
export class CheckDipIntegrityService implements CheckDipIntegrityUseCase {
  constructor(
    @inject(TOKENS.DocumentRepository)
    private readonly documentRepository: DocumentRepository,
    @inject(TOKENS.FileSystemProvider)
    private readonly fileSystemProvider: FileSystemProvider,
    @inject(TOKENS.Base64Provider)
    private readonly base64Provider: Base64Provider,
    @inject(TOKENS.HashProvider)
    private readonly hashProvider: HashProvider,
  ) {}

  private async computeFileHash(
    document: Document,
    file: File,
    trace: string | null,
    algorithm: string | null,
  ): Promise<boolean> {
    if (!trace || !algorithm) return false;
    const expected = this.base64Provider.decodeToBytes(trace);
    const filePath = path.join(document.getPath(), file.getPath());
    const actual = await this.hashProvider.hashStream(
      this.fileSystemProvider.createReadStream(filePath),
      this.hashProvider.toHashAlgorithm(algorithm),
    );
    return this.hashProvider.areEqualsHashBytes(expected, actual);
  }

  public async *execute(dipUuid: string): AsyncGenerator<DocumentIntegrityResponseDTO> {
    // TODO: controllare che il DiP esista
    const documents = await this.documentRepository.findAllByDipUuid(dipUuid, true);
    // TODO: controllare che abbia documenti

    for (const doc of documents) {
      const trace = doc.getMetadataValueByRegex(
        /[a-zA-Z]+\.IdDoc\.ImprontaCrittograficaDelDocumento\.Impronta$/,
      );
      const algorithm = doc.getMetadataValueByRegex(
        /[a-zA-Z]+\.IdDoc.\ImprontaCrittograficaDelDocumento\.Algoritmo$/,
      );

      const attachmentsByUuid = new Map(doc.getAttachments().map((att) => [att.getUuid(), att]));

      const attachmentsPromises = [];
      for (let i = 0; i < doc.getAttachments().length; i++) {
        const attUuid = doc.getMetadataValueByRegex(
          new RegExp(`[a-zA-Z]+\\.Allegati\\.IndiceAllegati\\.${i}\\.IdDoc\\.Identificativo$`),
        );
        if (!attUuid) continue;

        const att = attachmentsByUuid.get(attUuid);
        if (!att) continue;

        const attTrace = doc.getMetadataValueByRegex(
          new RegExp(
            `[a-zA-Z]+\\.Allegati\\.IndiceAllegati\\.${i}\\.IdDoc\\.ImprontaCrittograficaDelDocumento.Impronta$`,
          ),
        );
        const attAlgorithm = doc.getMetadataValueByRegex(
          new RegExp(
            `[a-zA-Z]+\\.Allegati\\.IndiceAllegati\\.${i}\\.IdDoc\\.ImprontaCrittograficaDelDocumento.Algoritmo$`,
          ),
        );

        if (!attTrace || !attAlgorithm) continue;

        attachmentsPromises.push(
          this.computeFileHash(doc, att, attTrace, attAlgorithm).then((status) => ({
            uuid: att.getUuid(),
            status,
          })),
        );
      }

      const [mainResult, ...attachmentsResults] = await Promise.all([
        this.computeFileHash(doc, doc.getMain(), trace, algorithm),
        ...attachmentsPromises,
      ]);

      yield {
        integrity: { uuid: doc.getUuid(), status: mainResult },
        attachments: attachmentsResults,
      };
    }
  }
}
