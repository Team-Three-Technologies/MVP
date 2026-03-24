import { injectable } from 'tsyringe';
import { IHashService } from './hash.service.interface';
import * as crypto from 'crypto';
import * as fs from 'fs';

@injectable()
export class SHA256HashServiceImpl implements IHashService {
  public async compute(filePath: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }
}