import { injectable } from 'tsyringe';
import { AutoImportDipUseCase } from './auto-import-dip.use-case';

@injectable()
export class AutoImportDipService implements AutoImportDipUseCase {
  constructor() { } 

  async execute(): Promise<void> {
    console.log('test');
  }
}