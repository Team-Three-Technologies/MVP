import { Buffer } from 'node:buffer';
import { Readable } from 'node:stream';

export interface FileSystemProvider {
  getStartDir(): string;
  ensureDir(dir: string): Promise<void>;
  findFile(dir: string, namePattern: RegExp): Promise<string | null>;
  readFile(path: string): Promise<Buffer>;
  readDir(path: string): Promise<string[]>;
  createReadStream(path: string): Readable;
}
