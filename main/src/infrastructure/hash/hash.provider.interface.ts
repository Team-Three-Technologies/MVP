import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';

export interface HashProvider {
  hashStream(stream: Readable, algorithm: string): Promise<Buffer>;
  areEqualsHashBytes(hashA: Buffer, hashB: Buffer): boolean;
}
