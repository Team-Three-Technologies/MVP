import { injectable } from 'tsyringe';
import { IDipRepository } from './dip.repository.interface';
import { Dip } from '../models/dip.model'
import { DipRow } from './dip.row'
import Database from 'better-sqlite3';
@injectable()
export class SQLiteDipRepository implements IDipRepository {
  constructor(private readonly db: Database.Database) {}

  public save(dip: Dip): Dip {
    this.db
      .prepare(`
        INSERT INTO pacchetti_dip (uuid_processo, data_creazione, numero_documenti, numero_aip)
        VALUES (@uuid, @date, @docsCount, @aipCount)
      `)
      .run({
        uuid: dip.uuid,
        date: dip.creationDate.toISOString(),
        docsCount: dip.docsCount,
        aipCount: dip.aipCount
      });
    return dip;
  }
}