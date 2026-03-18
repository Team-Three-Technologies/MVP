import { injectable } from 'tsyringe';
import { IZipService } from './zip.service.interface';
import * as unzipper from 'unzipper';
import * as fs from 'fs';
import * as fsp from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

@injectable()
export class ZipServiceImpl implements IZipService {
  async extract(zipPath: string): Promise<string> {
    const tempDir = await fsp.mkdtemp(
      path.join(os.tmpdir(), 'dipreader-')
    );

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: tempDir }))
        .on('close', resolve)
        .on('error', reject);
    });

    return tempDir;
  }
}