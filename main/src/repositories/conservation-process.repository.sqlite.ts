import { inject, injectable } from 'tsyringe';
import { ConservationProcessRepository } from './conservation-process.repository.interface';
import { TOKENS } from '../infrastructure/di/tokens';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { ConservationProcess } from '../domain/conservation-process.model';
import { ConservationProcessRow } from './conservation-process.row';

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
        INSERT INTO processi_conservazione (uuid, data_creazione, dimensione_totale, numero_sip, numero_documenti, numero_file_documenti, uuid_classe_documentale)
        VALUES (@uuid, @creationDate, @totalSize, @sipCount, @documentsCount, @filesCount, @documentClassUuid);
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
      });

    return conservationProcess;
  }

  public async findAllByDipUuid(dipUuid: string): Promise<ConservationProcess[]> {
    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT pc.uuid, pc.data_creazione, pc.dimensione_totale, pc.numero_sip, pc.numero_documenti, pc.numero_file_documenti, pc.uuid_classe_documentale FROM processi_conservazione pc
        JOIN classi_documentali cd ON pc.uuid_classe_documentale = cd.uuid
        JOIN archivi_dip ad ON cd.uuid_dip = ad.uuid_processo
        WHERE ad.uuid_processo = ?;
      `,
      )
      .all(dipUuid) as ConservationProcessRow[];

    return rows.map((row: ConservationProcessRow) => {
      return new ConservationProcess(
        row.uuid,
        new Date(row.data_creazione),
        row.dimensione_totale,
        row.numero_sip,
        row.numero_documenti,
        row.numero_file_documenti,
        row.uuid_classe_documentale,
      );
    });
  }

  public async findAllByDocumentClassUuid(
    documentClassUuid: string,
  ): Promise<ConservationProcess[]> {
    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT pc.uuid, pc.data_creazione, pc.dimensione_totale, pc.numero_sip, pc.numero_documenti, pc.numero_file_documenti, pc.uuid_classe_documentale FROM processi_conservazione pc
        JOIN classi_documentali cd ON pc.uuid_classe_documentale = cd.uuid
        WHERE cd.uuid = ?;
      `,
      )
      .all(documentClassUuid) as ConservationProcessRow[];

    return rows.map((row: ConservationProcessRow) => {
      return new ConservationProcess(
        row.uuid,
        new Date(row.data_creazione),
        row.dimensione_totale,
        row.numero_sip,
        row.numero_documenti,
        row.numero_file_documenti,
        row.uuid_classe_documentale,
      );
    });
  }
}
