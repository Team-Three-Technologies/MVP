import { Readable } from 'node:stream';
import { Buffer } from 'node:buffer';
import { HashAlgorithm } from './hash.algorithms';

export interface HashProvider {
  toHashAlgorithm(metadataValue: string): HashAlgorithm;
  hashStream(stream: Readable, algorithm: string): Promise<Buffer>;
  areEqualsHashBytes(hashA: Buffer, hashB: Buffer): boolean;
}
