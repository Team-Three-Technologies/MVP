import 'reflect-metadata';
import { describe, it, expect, beforeEach, afterEach, vi, Mock } from 'vitest';
import { container } from 'tsyringe';
import * as path from 'node:path';
import { Buffer } from 'node:buffer';

import { DatabaseProvider } from '../../src/infrastructure/database/database.provider';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { AppConfig } from '../../src/infrastructure/app.config';
import Database from 'better-sqlite3';
import { FileSystemProvider } from '../../src/infrastructure/fs/file-system.provider.interface';


// --- Migration reali usate come fixture ---
const MIGRATION_001 = `CREATE TABLE IF NOT EXISTS archivi_dip (
    uuid_processo TEXT PRIMARY KEY,
    data_creazione TEXT NOT NULL,
    numero_documenti INTEGER NOT NULL,
    numero_aip INTEGER NOT NULL
);`;

const MIGRATION_002 = `CREATE TABLE IF NOT EXISTS metadata_filter_match (
    type TEXT NOT NULL,
    nome_pattern TEXT NOT NULL,
    PRIMARY KEY (type, nome_pattern)
);`;

// --- Mock di better-sqlite3 ---
const execMock = vi.fn();
const getMock = vi.fn();
const runMock = vi.fn();
const prepareMock = vi.fn(() => ({ get: getMock, run: runMock }));
const pragmaMock = vi.fn();

const dbInstanceMock = {
  exec: execMock,
  prepare: prepareMock,
  pragma: pragmaMock,
};

vi.mock('better-sqlite3', () => ({
  default: vi.fn(() => dbInstanceMock),
}));

describe('DatabaseProvider', () => {
  let fsMock: {
    ensureDir: Mock;
    readDir: Mock;
    readFile: Mock;
    findFile: Mock;
    getStartDir: Mock;
    createReadStream: Mock;
    copyFile: Mock;
    createTempFile: Mock;
  };

  let config: AppConfig;
  let provider: DatabaseProvider;

  beforeEach(() => {
    vi.clearAllMocks();

    config = {
      migrationsPath: '/app/migrations',
      documentsPath: '/app/documents',
      appDir: '/app',
    };

    fsMock = {
      ensureDir: vi.fn().mockResolvedValue(null),
      readDir: vi.fn().mockResolvedValue([]),
      readFile: vi.fn().mockResolvedValue(Buffer.from('')),
      findFile: vi.fn(),
      getStartDir: vi.fn(),
      createReadStream: vi.fn(),
      copyFile: vi.fn(),
      createTempFile: vi.fn(),
    };

    container.reset();
    container.register<AppConfig>(TOKENS.AppConfig, { useValue: config });
    container.register<FileSystemProvider>(TOKENS.FileSystemProvider, {
      useValue: fsMock as unknown as FileSystemProvider,
    });

    provider = container.resolve(DatabaseProvider);
  });

  afterEach(() => {
    container.reset();
  });

  describe('instance getter', () => {
    it('lancia errore se non inizializzato', () => {
      expect(() => provider.instance).toThrow('DatabaseProvider non inizializzato');
    });

    it('ritorna la connessione dopo init', async () => {
      await provider.init();
      expect(provider.instance).toBe(dbInstanceMock);
    });
  });

  describe('init', () => {
    it('crea la directory documents, apre il DB e imposta i pragma', async () => {
      await provider.init();

      expect(fsMock.ensureDir).toHaveBeenCalledWith(config.documentsPath);
      expect(Database).toHaveBeenCalledWith(path.join(config.documentsPath, 'app.db'));
      expect(pragmaMock).toHaveBeenCalledWith('journal_mode = WAL');
      expect(pragmaMock).toHaveBeenCalledWith('foreign_keys = ON');
    });

    it('continua anche se ensureDir di documentsPath fallisce', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      fsMock.ensureDir.mockRejectedValueOnce(new Error('boom'));

      await expect(provider.init()).resolves.not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();
      expect(Database).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('crea la tabella migrations', async () => {
      await provider.init();

      const execCalls = execMock.mock.calls.map((c) => c[0]);
      expect(
        execCalls.some((sql: string) => /CREATE TABLE IF NOT EXISTS migrations/.test(sql)),
      ).toBe(true);
    });
  });

  describe('runMigrations', () => {
    it('esegue 001_init.sql e 002_filters_mapper.sql in ordine alfabetico', async () => {
      // Passate volutamente invertite per verificare il sort
      fsMock.readDir.mockResolvedValueOnce(['002_filters_mapper.sql', '001_init.sql']);
      fsMock.readFile
        .mockResolvedValueOnce(Buffer.from(MIGRATION_001, 'utf8'))
        .mockResolvedValueOnce(Buffer.from(MIGRATION_002, 'utf8'));
      getMock.mockReturnValue(undefined);

      await provider.init();

      expect(fsMock.readFile).toHaveBeenNthCalledWith(
        1,
        path.join(config.migrationsPath, '001_init.sql'),
      );
      expect(fsMock.readFile).toHaveBeenNthCalledWith(
        2,
        path.join(config.migrationsPath, '002_filters_mapper.sql'),
      );

      const execSqls = execMock.mock.calls.map((c) => c[0]);
      expect(execSqls).toContain(MIGRATION_001);
      expect(execSqls).toContain(MIGRATION_002);

      expect(prepareMock).toHaveBeenCalledWith(
        'INSERT INTO migrations (name, run_at) VALUES (?, ?);',
      );
      expect(runMock).toHaveBeenCalledTimes(2);
      expect(runMock.mock.calls[0][0]).toBe('001_init.sql');
      expect(runMock.mock.calls[1][0]).toBe('002_filters_mapper.sql');
    });

    it('salta le migrazioni già applicate', async () => {
      fsMock.readDir.mockResolvedValueOnce(['001_init.sql', '002_filters_mapper.sql']);
      fsMock.readFile.mockResolvedValueOnce(Buffer.from(MIGRATION_002, 'utf8'));

      getMock
        .mockReturnValueOnce({ name: '001_init.sql' })
        .mockReturnValueOnce(undefined);

      await provider.init();

      expect(fsMock.readFile).toHaveBeenCalledTimes(1);
      expect(fsMock.readFile).toHaveBeenCalledWith(
        path.join(config.migrationsPath, '002_filters_mapper.sql'),
      );

      expect(runMock).toHaveBeenCalledTimes(1);
      expect(runMock.mock.calls[0][0]).toBe('002_filters_mapper.sql');

      const execSqls = execMock.mock.calls.map((c) => c[0]);
      expect(execSqls).not.toContain(MIGRATION_001);
      expect(execSqls).toContain(MIGRATION_002);
    });

    it('non esegue nulla se tutte le migrazioni sono già applicate', async () => {
      fsMock.readDir.mockResolvedValueOnce(['001_init.sql', '002_filters_mapper.sql']);
      getMock
        .mockReturnValueOnce({ name: '001_init.sql' })
        .mockReturnValueOnce({ name: '002_filters_mapper.sql' });

      await provider.init();

      expect(fsMock.readFile).not.toHaveBeenCalled();
      expect(runMock).not.toHaveBeenCalled();
    });

    it('non fa nulla se la cartella migrations è vuota', async () => {
      fsMock.readDir.mockResolvedValueOnce([]);

      await provider.init();

      expect(fsMock.readFile).not.toHaveBeenCalled();
      expect(runMock).not.toHaveBeenCalled();
    });

    it('registra timestamp ISO valido nella insert', async () => {
      fsMock.readDir.mockResolvedValueOnce(['001_init.sql']);
      fsMock.readFile.mockResolvedValueOnce(Buffer.from(MIGRATION_001, 'utf8'));
      getMock.mockReturnValueOnce(undefined);

      await provider.init();

      const runAt = runMock.mock.calls[0][1] as string;
      expect(() => new Date(runAt).toISOString()).not.toThrow();
      expect(new Date(runAt).toISOString()).toBe(runAt);
    });
  });
});
