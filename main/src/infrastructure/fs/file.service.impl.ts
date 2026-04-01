import { injectable } from 'tsyringe';
import { FileService } from './file.service.interface';
import * as fsp from 'fs/promises';
import * as path from 'path';

@injectable()
export class FileServiceImpl implements FileService {
  private readonly DIP_INDEX_NAME_PATTERN = /^DiPIndex\.\d{8}\.[0-9a-f-]+\.xml$/i;

  public async findDipIndex(dir: string): Promise<string | null> {
    const files = await fsp.readdir(dir);
    const found = files.find(f => this.DIP_INDEX_NAME_PATTERN.test(f));

    return found ? path.join(dir, found) : null;
  }
}