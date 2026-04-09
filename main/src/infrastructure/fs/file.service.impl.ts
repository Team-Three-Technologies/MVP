import { injectable } from 'tsyringe';
import { FileService } from './file.service.interface';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

@injectable()
export class FileServiceImpl implements FileService {
  private readonly DIP_INDEX_NAME_PATTERN = /^DiPIndex\.\d{4}\d{1,2}\d{1,2}\.[0-9a-f-]+\.xml$/i; // DiPIndex.AAAA[M o MM][G o GG].UUID.xml

  public async findDipIndex(dir: string): Promise<string | null> {
    const files = await fsp.readdir(dir);
    const found = files.find(f => this.DIP_INDEX_NAME_PATTERN.test(f));

    return found ? path.join(dir, found) : null;
  }
}