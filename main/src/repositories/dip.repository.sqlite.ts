import { inject, injectable } from 'tsyringe';
import { IDipRepository } from './dip.repository.interface';
import { Dip } from '../models/dip.model'
import { DipRow } from './dip.row'
import { DatabaseProvider } from '../infrastructure/database.provider';

@injectable()
export class SQLiteDipRepository implements IDipRepository {
  constructor(
    @inject(DatabaseProvider) private readonly db: DatabaseProvider
  ) { }

  public save(dip: Dip): Dip {
    this.db.instance
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