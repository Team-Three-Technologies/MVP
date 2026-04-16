import { injectable } from 'tsyringe';
import { HashService } from './hash.service.interface';
import * as crypto from 'node:crypto';
import * as fs from 'node:fs';

@injectable()
export class SHA256HashServiceImpl implements HashService {
  public async compute(filePath: string): Promise<string> {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }
}
