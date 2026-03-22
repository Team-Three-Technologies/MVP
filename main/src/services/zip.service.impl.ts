import { injectable } from 'tsyringe';
import { IZipService } from './zip.service.interface';
import * as Seven from 'node-7z';
import sevenBin from '7zip-bin';
import * as fsp from 'fs/promises';

@injectable()
export class ZipServiceImpl implements IZipService {
  async extract(zipPath: string, destPath: string): Promise<void> {
    await fsp.mkdir(destPath, { recursive: true });

    await new Promise<void>((resolve, reject) => {
      const stream = Seven.extractFull(zipPath, destPath, {
        $bin: sevenBin.path7za
      });
      stream.on('end', resolve);
      stream.on('error', reject);
    });
  }
}