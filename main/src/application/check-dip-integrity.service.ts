import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/di/tokens';
import { CheckDipIntegrityUseCase } from './check-dip-integrity.use-case';
import { DocumentRepository } from '../repositories/document.repository.interface';
import { FileSystemProvider } from '../infrastructure/fs/file-system.provider.interface';
import { Base64Provider } from '../infrastructure/base64/base64.provider.interface';
import { HashProvider } from '../infrastructure/hash/hash.provider.interface';
import { DipIntegrityResponseDTO } from '../../../shared/response/dip-integrity.response.dto';
import * as path from 'node:path';
import { HASH_ALGORITHMS } from '../infrastructure/hash/hash.algorithms';

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

  public async execute(dipUuid: string): Promise<DipIntegrityResponseDTO> {
    const documents = await this.documentRepository.findAllByDipUuid(dipUuid);

    const results = [];

    for (const doc of documents) {
      const trace = doc.getMetadataValueByName(
        'DocumentoInformatico.IdDoc.ImprontaCrittograficaDelDocumento.Impronta',
      );
      const algorithm = doc.getMetadataValueByName(
        'DocumentoInformatico.IdDoc.ImprontaCrittograficaDelDocumento.Algoritmo',
      );
      let result = false;
      if (trace && algorithm) {
        const expectedHash = this.base64Provider.decodeToBytes(trace);
        const docPath = path.join(doc.getPath(), doc.getMain().getPath());
        const actualHash = await this.hashProvider.hashStream(
          this.fileSystemProvider.createReadStream(docPath),
          HASH_ALGORITHMS.SHA256,
        );
        result = this.hashProvider.areEqualsHashBytes(expectedHash, actualHash);
      }
      const attachments = [];
      for (const att of doc.getAttachments()) {
        for (let i = 0; i < doc.getAttachments().length; i++) {
          const attUuid = doc.getMetadataValueByName(
            `DocumentoInformatico.Allegati.IndiceAllegati.${i}.IdDoc.Identificativo`,
          );
          if (attUuid && att.getUuid() === attUuid) {
            const attTrace = doc.getMetadataValueByName(
              `DocumentoInformatico.Allegati.IndiceAllegati.${i}.IdDoc.ImprontaCrittograficaDelDocumento.Impronta`,
            );
            if (attTrace) {
              const expectedHash = this.base64Provider.decodeToBytes(attTrace);
              const attPath = path.join(doc.getPath(), att.getPath());
              const actualHash = await this.hashProvider.hashStream(
                this.fileSystemProvider.createReadStream(attPath),
                HASH_ALGORITHMS.SHA256,
              );
              const result = this.hashProvider.areEqualsHashBytes(expectedHash, actualHash);
              attachments.push({ uuid: att.getUuid(), status: result });
            }
          }
        }
      }
      results.push({
        integrity: { uuid: doc.getUuid(), status: result },
        attachments: attachments,
      });
    }

    return { documents: results };
  }
}
