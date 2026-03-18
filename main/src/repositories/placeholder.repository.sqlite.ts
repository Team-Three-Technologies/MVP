// just to push
import { injectable } from 'tsyringe';
import { IPlaceholderRepository } from './placeholder.repository.interface';
import { DatabaseProvider } from '../infrastructure/database.provider';

@injectable()
export class SQLitePlaceholderRepository implements IPlaceholderRepository {
  constructor(
    @inject(DatabaseProvider) private readonly db: DatabaseProvider
  ) { }

  save(): void {

  }
  delete(): void {

  }
  findAll(): void { }
}