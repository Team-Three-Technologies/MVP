import { Document } from '../../src/domain/document.model';
import { describe, expect, it } from 'vitest';
import { File } from '../../src/domain/file.model';
import { Metadata } from '../../src/domain/metadata.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';

describe('Document', () => {
  it('getter restituiscono correttamente contenuto', () => {
    const document = new Document(
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'path/to/test',
      new File('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', '/main.test', '12543 bytes'),
      [new File('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', '/uuid/att.test', '123 bytes')],
      [new Metadata('Nome', 'Valore', MetadataTypeEnum.STRING)],
      'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz',
    );

    expect(document.getUuid()).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    expect(document.getPath()).toBe('path/to/test');
    expect(document.getMain()).toStrictEqual(
      new File('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', '/main.test', '12543 bytes'),
    );
    expect(document.getAttachments()).toStrictEqual([
      new File('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', '/uuid/att.test', '123 bytes'),
    ]);
    expect(document.getMetadata()).toStrictEqual([
      new Metadata('Nome', 'Valore', MetadataTypeEnum.STRING),
    ]);
    expect(document.getConservationProcessUuid()).toBe('zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz');

    expect(document.getMetadataValueByName('Nome')).toBe('Valore');
    expect(document.getMetadataValueByName('NonNome')).toBe(null);
    expect(document.getMetadataValueByRegex(/No[a-zA-Z]+$/)).toBe('Valore');
    expect(document.getMetadataValueByRegex(/Nn[a-zA-Z]+$/)).toBe(null);
  });

  it('setter impostano correttamente contenuto', () => {
    const document = new Document(
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'path/to/test',
      new File('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', '/main.test', '12543 bytes'),
      [new File('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', '/uuid/att.test', '123 bytes')],
      [new Metadata('Nome', 'Valore', MetadataTypeEnum.STRING)],
      'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz',
    );

    document.setUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1');
    document.setPath('path/to/test2');
    document.setMain(
      new File('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1', '/main1.test', '4432423 bytes'),
    );
    document.setAttachments([
      new File('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyy1', '/uuid/at1t.test', '234 bytes'),
    ]);
    document.setMetadata([new Metadata('Nom3', 'Valor3', MetadataTypeEnum.STRING)]);
    document.setConservationProcessUuid('zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzz1');

    expect(document.getUuid()).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1');
    expect(document.getPath()).toBe('path/to/test2');
    expect(document.getMain()).toStrictEqual(
      new File('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1', '/main1.test', '4432423 bytes'),
    );
    expect(document.getAttachments()).toStrictEqual([
      new File('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyy1', '/uuid/at1t.test', '234 bytes'),
    ]);
    expect(document.getMetadata()).toStrictEqual([
      new Metadata('Nom3', 'Valor3', MetadataTypeEnum.STRING),
    ]);
    expect(document.getConservationProcessUuid()).toBe('zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzz1');
  });
});
