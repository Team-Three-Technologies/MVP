import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { DipRepository } from './dip.repository.interface';
import { DatabaseProvider } from '../infrastructure/database.provider';
import { Dip } from '../domain/dip.model'
import { DipRow } from './dip.row'
import { UUID } from '../domain/value-objects/uuid.value-object';

@injectable()
export class SQLiteDipRepository implements DipRepository {
  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly dbProvider: DatabaseProvider
  ) { }

  public save(dip: Dip): Dip {
    this.dbProvider.istance
      .prepare(`
        INSERT INTO archivi_dip (uuid_processo, data_creazione, numero_documenti, numero_aip)
        VALUES (@uuid, @date, @docsCount, @aipCount);
      `)
      .run({
        uuid: dip.getProcessUuid().toString(),
        date: dip.getCreationDate().toISOString(),
        docsCount: dip.getDocumentsCount(),
        aipCount: dip.getAipCount()
      });
    return dip;
  }

  public findByUuid(uuid: UUID): Dip | null {
    const row = this.dbProvider.istance
      .prepare(`
        SELECT * FROM archivi_dip
        WHERE uuid_processo = ?
      `)
      .get(uuid.toString()) as DipRow;

      return row ? new Dip(UUID.from(row.uuid_processo), new Date(row.data_creazione), row.numero_documenti, row.numero_aip) : null;
  }

  public findAll(): Dip[] {
    const rows = this.dbProvider.istance
      .prepare(`SELECT * FROM archivi_dip;`)
      .all() as DipRow[];

    return rows.map((row: DipRow) => {
      return new Dip(UUID.from(row.uuid_processo), new Date(row.data_creazione), row.numero_documenti, row.numero_aip);
    });
  }
}