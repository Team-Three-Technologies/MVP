import { injectable } from 'tsyringe';
import { AutoImportDiPUseCase } from './auto-import-dip.use-case';

@injectable()
export class AutoImportDiPService implements AutoImportDiPUseCase {
  constructor() { } 

  async execute(): Promise<void> {
    console.log('test');
  }
}