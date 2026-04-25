import { Metadata } from '../../src/domain/metadata.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';
import { describe, expect, it } from 'vitest';

describe('Metadata', () => {
  it('getter restituiscono correttamente contenuto', () => {
    const metadata = new Metadata('Nome', 'valore', MetadataTypeEnum.STRING);

    expect(metadata.getName()).toBe('Nome');
    expect(metadata.getValue()).toBe('valore');
    expect(metadata.getType()).toBe(MetadataTypeEnum.STRING);
  });

  it('setter impostano correttamente contenuto', () => {
    const metadata = new Metadata('Nome', 'valore', MetadataTypeEnum.STRING);

    metadata.setName('Nome2');
    metadata.setValue('12');
    metadata.setType(MetadataTypeEnum.NUMBER);

    expect(metadata.getName()).toBe('Nome2');
    expect(metadata.getValue()).toBe('12');
    expect(metadata.getType()).toBe(MetadataTypeEnum.NUMBER);
  });
});
