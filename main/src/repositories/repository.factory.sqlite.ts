import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../infrastructure/tokens';
import { IRepositoryFactory } from './repository.factory.interface';
import { DatabaseProvider } from '../infrastructure/database.provider';
import { SQLiteDipRepository } from './dip.repository.sqlite';

@injectable()
export class SQLiteRepositoryFactory implements IRepositoryFactory {
  constructor(
    @inject(TOKENS.DatabaseProvider)
    private readonly databaseProvider: DatabaseProvider
  ) { }

  createDipRepository(dipUuid: string): SQLiteDipRepository {
    return new SQLiteDipRepository(this.databaseProvider.getDb(dipUuid));
  }
}