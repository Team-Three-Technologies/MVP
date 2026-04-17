import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../di/tokens';
import { FileSystemProvider } from './file-system.provider.interface';
import { AppConfig } from '../app.config';
import * as fsp from 'node:fs/promises';
import { createReadStream, Dirent } from 'node:fs';
import * as path from 'node:path';
import { Buffer } from 'node:buffer';
import { Readable } from 'node:stream';

@injectable()
export class LocalFileSystemProvider implements FileSystemProvider {
  constructor(
    @inject(TOKENS.AppConfig)
    private readonly config: AppConfig,
  ) {}

  public getStartDir(): string {
    return this.config.appDir;
  }

  public async ensureDir(dir: string): Promise<void> {
    fsp.mkdir(dir, { recursive: true });
  }

  public async findFile(dir: string, namePattern: RegExp): Promise<string | null> {
    const files: Dirent[] = await fsp.readdir(dir, { withFileTypes: true });

    const found = files.find((f) => f.isFile() && namePattern.test(f.name));

    return found ? path.join(dir, found.name) : null;
  }

  public async readFile(path: string): Promise<Buffer> {
    return await fsp.readFile(path);
  }

  public async readDir(path: string): Promise<string[]> {
    return await fsp.readdir(path);
  }

  public createReadStream(path: string): Readable {
    return createReadStream(path);
  }
}
