import { inject, injectable } from 'tsyringe';
import { DocumentClassRepository } from './document-class.repository.interface';
import { TOKENS } from '../infrastructure/di/tokens';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { DocumentClass } from '../domain/document-class.model';
import { DocumentClassRow } from './document-class.row';

@injectable()
export class SQLiteDocumentClassRepository implements DocumentClassRepository {
  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly dbProvider: DatabaseProvider,
  ) {}

  public async save(documentClass: DocumentClass): Promise<DocumentClass> {
    this.dbProvider.instance
      .prepare(
        `
        INSERT INTO classi_documentali (uuid, nome, versione, valida_da, valida_fino, uuid_dip)
        VALUES (@uuid, @name, @version, @validFrom, @validTo, @dipUuid);
      `,
      )
      .run({
        uuid: documentClass.getUuid(),
        name: documentClass.getName(),
        version: documentClass.getVersion(),
        validFrom: documentClass.getValidFrom().toISOString(),
        validTo: documentClass.getValidTo()?.toISOString() ?? null,
        dipUuid: documentClass.getDipUuid(),
      });

    return documentClass;
  }

  public async findAllByDipUuid(dipUuid: string): Promise<DocumentClass[]> {
    const rows = this.dbProvider.instance
      .prepare(
        `
        SELECT cd.uuid, cd.nome, cd.versione, cd.valida_da, cd.valida_fino, cd.uuid_dip FROM classi_documentali cd
        JOIN archivi_dip ad ON cd.uuid_dip = ad.uuid_processo
        WHERE ad.uuid_processo = ?; 
      `,
      )
      .all(dipUuid) as DocumentClassRow[];

    return rows.map((row: DocumentClassRow) => {
      return new DocumentClass(
        row.uuid,
        row.nome,
        row.versione,
        new Date(row.valida_da),
        row.valida_fino ? new Date(row.valida_fino) : undefined,
        row.uuid_dip,
      );
    });
  }
}
