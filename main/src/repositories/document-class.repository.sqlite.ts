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

}
