import { Dip } from '../../src/domain/dip.model';
import { describe, expect, it } from 'vitest';

describe('Dip', () => {
  it('getter restituiscono correttamente contenuto', () => {
    const dip = new Dip('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', new Date('17/07/2026'), 5, 2);

    expect(dip.getProcessUuid()).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    expect(dip.getCreationDate()).toStrictEqual(new Date('17/07/2026'));
    expect(dip.getDocumentsCount()).toBe(5);
    expect(dip.getAipCount()).toBe(2);
  });

  it('setter impostano correttamente contenuto', () => {
    const dip = new Dip('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', new Date('17/07/2026'), 5, 2);

    dip.setProcessUuid('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
    dip.setCreationDate(new Date('25/09/2026'));
    dip.setDocumentsCount(2);
    dip.setAipCount(5);

    expect(dip.getProcessUuid()).toBe('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
    expect(dip.getCreationDate()).toStrictEqual(new Date('25/09/2026'));
    expect(dip.getDocumentsCount()).toBe(2);
    expect(dip.getAipCount()).toBe(5);
  });
});
