import { injectable } from 'tsyringe';
import { IFileService } from './file.service.interface';
import * as fsp from 'fs/promises';
import * as path from 'path';

@injectable()
export class FileServiceImpl implements IFileService {
  private readonly DIP_INDEX_NAME = /^DiPIndex\.\d{8}\.[0-9a-f-]+\.xml$/i;

  public async findDipIndex(dir: string): Promise<string | null> {
    const files = await fsp.readdir(dir);
    const found = files.find(f => this.DIP_INDEX_NAME.test(f));

    return found ? path.join(dir, found) : null;
  }
}