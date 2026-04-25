import { File } from '../../src/domain/file.model';
import { describe, expect, it } from 'vitest';

describe('File', () => {
  it('getter restituiscono correttamente contenuto', () => {
    const file = new File(
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      '/path/to/test.png',
      '1929 bytes',
    );

    expect(file.getUuid()).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    expect(file.getPath()).toBe('/path/to/test.png');
    expect(file.getSize()).toBe('1929 bytes');
  });

  it('getter con logica restituiscono correttamente contenuto (#1)', () => {
    const file = new File(
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      '/path/to/test.png',
      '1929 bytes',
    );

    expect(file.getFilename()).toBe('test');
    expect(file.getExtension()).toBe('png');
  });

  it('getter con logica restituiscono correttamente contenuto (#2)', () => {
    const file = new File('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', '/path/to/test', '1929 bytes');

    expect(file.getFilename()).toBe('test');
    expect(file.getExtension()).toBe('');
  });

  it('setter impostano correttamente contenuto', () => {
    const file = new File(
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      '/path/to/test.png',
      '1929 bytes',
    );

    file.setUuid('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
    file.setPath('/path/to/other/test.png');
    file.setSize('56432 bytes');

    expect(file.getUuid()).toBe('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
    expect(file.getPath()).toBe('/path/to/other/test.png');
    expect(file.getSize()).toBe('56432 bytes');
  });
});
