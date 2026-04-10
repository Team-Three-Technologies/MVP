import { injectable } from 'tsyringe';
import { FileFinder } from './file.finder.interface';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

@injectable()
export class FileFinderImpl implements FileFinder {
  private readonly DIP_INDEX_NAME_PATTERN = /^DiPIndex\.\d{4}\d{1,2}\d{1,2}\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.xml$/i; // DiPIndex.AAAA[M o MM][G o GG].UUID.xml
  private readonly AIP_INFO_NAME_PATTERN = /^AiPInfo\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.xml$/i;

  public async findDipIndex(dir: string): Promise<string | null> {
    const files = await fsp.readdir(dir);
    const found = files.find(f => this.DIP_INDEX_NAME_PATTERN.test(f));

    return found ? path.join(dir, found) : null;
  }
  
  public async findAipInfo(dir: string): Promise<string | null> {
    const files = await fsp.readdir(dir);
    const found = files.find(f => this.AIP_INFO_NAME_PATTERN.test(f));

    return found ? path.join(dir, found) : null;
  }
}