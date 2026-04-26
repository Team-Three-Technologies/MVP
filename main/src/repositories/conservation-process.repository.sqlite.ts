import { inject, injectable } from 'tsyringe';
import { ConservationProcessRepository } from './conservation-process.repository.interface';
import { TOKENS } from '../infrastructure/di/tokens';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { ConservationProcess } from '../domain/conservation-process.model';

@injectable()
export class SQLiteConservationProcessRepository implements ConservationProcessRepository {
  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly dbProvider: DatabaseProvider,
  ) {}

  public async save(conservationProcess: ConservationProcess): Promise<ConservationProcess> {
    this.dbProvider.instance
      .prepare(
        `
        INSERT INTO processi_conservazione (uuid, data_creazione, dimensione_totale, numero_sip, numero_documenti, numero_file_documenti, uuid_classe_documentale, versione_classe_documentale)
        VALUES (@uuid, @creationDate, @totalSize, @sipCount, @documentsCount, @filesCount, @documentClassUuid, @documentClassVersion);
      `,
      )
      .run({
        uuid: conservationProcess.getUuid(),
        creationDate: conservationProcess.getCreationDate().toISOString(),
        totalSize: conservationProcess.getTotalSize(),
        sipCount: conservationProcess.getSipCount(),
        documentsCount: conservationProcess.getDocumentsCount(),
        filesCount: conservationProcess.getFilesCount(),
        documentClassUuid: conservationProcess.getDocumentClassUuid(),
        documentClassVersion: conservationProcess.getDocumentClassVersion(),
      });

    return conservationProcess;
  }
}
