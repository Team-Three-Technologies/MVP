import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocalFileSystemProvider } from '../../src/infrastructure/fs/file-system.provider.local';
import { Readable } from 'node:stream';
import * as path from 'node:path';

vi.mock('node:fs/promises', () => {
  return {
    mkdir: vi.fn(),
    readdir: vi.fn(),
    readFile: vi.fn(),
    copyFile: vi.fn(),
  };
});

vi.mock('node:fs', () => {
  return {
    createReadStream: vi.fn(),
  };
});

vi.mock('electron', () => {
  return {
    app: {
      getPath: vi.fn(() => '/tmp'),
    },
  };
});

import * as fsp from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { app } from 'electron';

describe('LocalFileSystemProvider', () => {
  const config = { appDir: '/app' } as any;
  let provider: LocalFileSystemProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new LocalFileSystemProvider(config);
  });

  it('getStartDir ritorna appDir (con gestione win32)', () => {
    const res = provider.getStartDir();
    const expected = process.platform === 'win32' ? '\\\\?\\' + path.resolve('/app') : '/app';
    expect(res).toBe(expected);
  });

  it('ensureDir ritorna path creato', async () => {
    (fsp.mkdir as any).mockResolvedValue('/app/data');
    const res = await provider.ensureDir('/app/data');
    expect(res).toBe('/app/data');
    expect(fsp.mkdir).toHaveBeenCalledWith('/app/data', { recursive: true });
  });

  it('ensureDir lancia errore custom su failure', async () => {
    (fsp.mkdir as any).mockRejectedValue(new Error('fail'));
    await expect(provider.ensureDir('/app/data')).rejects.toThrow('Creazione directory fallita');
  });

  it('findFile trova il primo file che matcha', async () => {
    (fsp.readdir as any).mockResolvedValue([
      { isFile: () => false, name: 'a' },
      { isFile: () => true, name: 'target.txt' },
    ]);
    const res = await provider.findFile('/dir', /target/);
    expect(res).toBe(path.join('/dir', 'target.txt'));
  });

  it('findFile ritorna null se non trova', async () => {
    (fsp.readdir as any).mockResolvedValue([{ isFile: () => true, name: 'x.txt' }]);
    const res = await provider.findFile('/dir', /target/);
    expect(res).toBeNull();
  });

  it('readFile usa fs.promises.readFile', async () => {
    const buf = Buffer.from('abc');
    (fsp.readFile as any).mockResolvedValue(buf);
    const res = await provider.readFile('/file');
    expect(res).toBe(buf);
    expect(fsp.readFile).toHaveBeenCalledWith('/file');
  });

  it('readDir usa fs.promises.readdir', async () => {
    (fsp.readdir as any).mockResolvedValue(['a', 'b']);
    const res = await provider.readDir('/dir');
    expect(res).toEqual(['a', 'b']);
  });

  it('createReadStream ritorna stream da fs', () => {
    const stream = new Readable();
    (createReadStream as any).mockReturnValue(stream);
    const res = provider.createReadStream('/file');
    expect(res).toBe(stream);
  });

  it('copyFile chiama fs.promises.copyFile', async () => {
    (fsp.copyFile as any).mockResolvedValue(undefined);
    await provider.copyFile('/src', '/dest');
    expect(fsp.copyFile).toHaveBeenCalledWith('/src', '/dest');
  });

  it('copyFile lancia errore custom su failure', async () => {
    (fsp.copyFile as any).mockRejectedValue(new Error('fail'));
    await expect(provider.copyFile('/src', '/dest')).rejects.toThrow('Copia file fallita');
  });

  it('createTempFile copia nel temp e ritorna path', async () => {
    (fsp.copyFile as any).mockResolvedValue(undefined);
    const res = await provider.createTempFile('/src/file.txt');
    const expectedTmp = path.join('/tmp', 'file.txt');
    expect(app.getPath).toHaveBeenCalledWith('temp');
    expect(fsp.copyFile).toHaveBeenCalledWith('/src/file.txt', expectedTmp);
    expect(res).toBe(expectedTmp);
  });
});
