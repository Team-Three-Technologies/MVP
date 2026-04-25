import { DocumentClass } from '../../src/domain/document-class.model';
import { describe, expect, it } from 'vitest';

describe('DocumentClass', () => {
  it('getter restituiscono correttamente contenuto', () => {
    const documentClass = new DocumentClass(
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Test',
      '1.0',
      new Date('17/07/2026'),
      new Date('25/09/2026'),
      'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
    );

    expect(documentClass.getUuid()).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    expect(documentClass.getName()).toBe('Test');
    expect(documentClass.getVersion()).toBe('1.0');
    expect(documentClass.getValidFrom()).toStrictEqual(new Date('17/07/2026'));
    expect(documentClass.getValidTo()).toStrictEqual(new Date('25/09/2026'));
    expect(documentClass.getDipUuid()).toBe('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
  });

  it('setter impostano correttamente contenuto', () => {
    const documentClass = new DocumentClass(
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      'Test',
      '1.0',
      new Date('17/07/2026'),
      new Date('25/09/2026'),
      'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
    );

    documentClass.setUuid('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
    documentClass.setName('Tset');
    documentClass.setVersion('0.1');
    documentClass.setValidFrom(new Date('25/09/2026'));
    documentClass.setValidTo(new Date('17/07/2026'));
    documentClass.setDipUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');

    expect(documentClass.getUuid()).toBe('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
    expect(documentClass.getName()).toBe('Tset');
    expect(documentClass.getVersion()).toBe('0.1');
    expect(documentClass.getValidFrom()).toStrictEqual(new Date('25/09/2026'));
    expect(documentClass.getValidTo()).toStrictEqual(new Date('17/07/2026'));
    expect(documentClass.getDipUuid()).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  });
});
