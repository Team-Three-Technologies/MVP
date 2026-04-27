import { inject, injectable } from 'tsyringe';
import { DipRepository } from './dip.repository.interface';
import { TOKENS } from '../infrastructure/di/tokens';
import { DatabaseProvider } from '../infrastructure/database/database.provider';
import { Dip } from '../domain/dip.model';
import { DipRow } from './dip.row';

@injectable()
export class SQLiteDipRepository implements DipRepository {
  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly dbProvider: DatabaseProvider,
  ) {}

  public async save(dip: Dip): Promise<Dip> {
    this.dbProvider.instance
      .prepare(
        `
        INSERT INTO archivi_dip (uuid_processo, data_creazione, numero_documenti, numero_aip)
        VALUES (@uuid, @date, @docsCount, @aipCount);
      `,
      )
      .run({
        uuid: dip.getProcessUuid(),
        date: dip.getCreationDate().toISOString(),
        docsCount: dip.getDocumentsCount(),
        aipCount: dip.getAipCount(),
      });

    return dip;
  }

  public async deleteByUuid(uuid: string): Promise<void> {
    this.dbProvider.instance
      .prepare(
        `
        DELETE FROM archivi_dip
        WHERE uuid_processo = ?; 
      `,
      )
      .run(uuid);

    return;
  }

  public async findByUuid(uuid: string): Promise<Dip | null> {
    const row = this.dbProvider.instance
      .prepare(
        `
        SELECT * FROM archivi_dip
        WHERE uuid_processo = ?;
      `,
      )
      .get(uuid) as DipRow;

    return row
      ? new Dip(
          row.uuid_processo,
          new Date(row.data_creazione),
          row.numero_documenti,
          row.numero_aip,
        )
      : null;
  }
}
