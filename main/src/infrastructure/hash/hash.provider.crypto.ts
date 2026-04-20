import { injectable } from 'tsyringe';
import { HashProvider } from './hash.provider.interface';
import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';
import { createHash, timingSafeEqual } from 'node:crypto';

@injectable()
export class CryptoHashProvider implements HashProvider {
  public async hashStream(stream: Readable, algorithm: string): Promise<Buffer> {
    return await new Promise<Buffer>((resolve, reject) => {
      const hash = createHash(algorithm);

      stream.on('data', (chunk: Buffer | string) => {
        hash.update(chunk);
      });

      stream.once('end', () => {
        resolve(hash.digest());
      });

      stream.once('error', reject);
    });
  }

  public areEqualsHashBytes(hashA: Buffer, hashB: Buffer): boolean {
    if (hashA.length !== hashB.length) return false;
    return timingSafeEqual(hashA, hashB);
  }
}
