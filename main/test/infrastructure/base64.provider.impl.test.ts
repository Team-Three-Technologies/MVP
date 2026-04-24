import { describe, expect, it } from 'vitest';
import { Base64ProviderImpl } from '../../src/infrastructure/base64/base64.provider.impl';

describe('Base64ProviderImpl', () => {
  it('decodeToBytes() restituisce il decode della stringa base64 in bytes', () => {
    const base64Provider = new Base64ProviderImpl();
    expect(base64Provider.decodeToBytes('dGVzdA==')).toStrictEqual(Buffer.from('test'));
  });

  it('decodeToBytes() gestisce stringa vuota', () => {
    const base64Provider = new Base64ProviderImpl();
    expect(base64Provider.decodeToBytes('')).toStrictEqual(Buffer.from(''));
  });

  it('decodeToBytes() gestisce base64 non valido (ritorna comunque un buffer)', () => {
    const base64Provider = new Base64ProviderImpl();
    expect(base64Provider.decodeToBytes('!!!')).toBeInstanceOf(Buffer);
  });
});
