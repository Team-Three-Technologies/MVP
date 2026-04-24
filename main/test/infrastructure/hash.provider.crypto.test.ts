import { describe, it, expect } from 'vitest';
import { CryptoHashProvider } from '../../src/infrastructure/hash/hash.provider.crypto';
import { Readable } from 'node:stream';

describe('CryptoHashProvider', () => {
  it('toHashAlgorithm() converte metadataValue in algoritmo hash supportato', () => {
    const cryptoHashProvider = new CryptoHashProvider();

    const result = cryptoHashProvider.toHashAlgorithm(' sha256 ');
    expect(result).toBe('sha256');
  });

  it('toHashAlgorithm() lancia errore se metadataValue non è algoritmo hash supportato', () => {
    const cryptoHashProvider = new CryptoHashProvider();

    expect(() => cryptoHashProvider.toHashAlgorithm('unknown')).toThrow(
      'Algoritmo hash non supportato nei metadata: unknown',
    );
  });

  it('hashStream() calcola hash da stream', async () => {
    const cryptoHashProvider = new CryptoHashProvider();

    const stream = Readable.from(['hello']);

    const result = await cryptoHashProvider.hashStream(stream, 'sha256');
    expect(result).toBeInstanceOf(Buffer);
  });

  it('hashStream() produce hash consistente per lo stesso input', async () => {
    const cryptoHashProvider = new CryptoHashProvider();

    const stream1 = Readable.from(['hello']);
    const stream2 = Readable.from(['hello']);

    const hash1 = await cryptoHashProvider.hashStream(stream1, 'sha256');
    const hash2 = await cryptoHashProvider.hashStream(stream2, 'sha256');

    expect(hash1.equals(hash2)).toBe(true);
  });

  it('areEqualsHashBytes() restituisce true per hash uguali', () => {
    const cryptoHashProvider = new CryptoHashProvider();

    const a = Buffer.from('abc');
    const b = Buffer.from('abc');

    expect(cryptoHashProvider.areEqualsHashBytes(a, b)).toBe(true);
  });

  it('areEqualsHashBytes() restituisce false per hash diversi', () => {
    const cryptoHashProvider = new CryptoHashProvider();

    const a = Buffer.from('abc');
    const b = Buffer.from('abcd');

    expect(cryptoHashProvider.areEqualsHashBytes(a, b)).toBe(false);
  });
});
