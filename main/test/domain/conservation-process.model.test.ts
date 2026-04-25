import { ConservationProcess } from '../../src/domain/conservation-process.model';
import { describe, expect, it } from 'vitest';

describe('ConservationProcess', () => {
  it('getter restituiscono correttamente contenuto', () => {
    const conservationProcess = new ConservationProcess(
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      new Date('17/07/2026'),
      '987 bytes',
      2,
      10,
      20,
      'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
      '1.2.1',
    );

    expect(conservationProcess.getUuid()).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    expect(conservationProcess.getCreationDate()).toStrictEqual(new Date('17/07/2026'));
    expect(conservationProcess.getTotalSize()).toBe('987 bytes');
    expect(conservationProcess.getSipCount()).toBe(2);
    expect(conservationProcess.getDocumentsCount()).toBe(10);
    expect(conservationProcess.getFilesCount()).toBe(20);
    expect(conservationProcess.getDocumentClassUuid()).toBe('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
    expect(conservationProcess.getDocumentClassVersion()).toBe('1.2.1');
  });

  it('setter impostano correttamente contenuto', () => {
    const conservationProcess = new ConservationProcess(
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      new Date('17/07/2026'),
      '987 bytes',
      2,
      10,
      20,
      'yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy',
      '1.2.1',
    );

    conservationProcess.setUuid('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
    conservationProcess.setCreationDate(new Date('17/07/2026'));
    conservationProcess.setTotalSize('91187 bytes');
    conservationProcess.setSipCount(3);
    conservationProcess.setDocumentsCount(2);
    conservationProcess.setFilesCount(4);
    conservationProcess.setDocumentClassUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    conservationProcess.setDocumentClassVersion('2.1.1');

    expect(conservationProcess.getUuid()).toBe('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy');
    expect(conservationProcess.getCreationDate()).toStrictEqual(new Date('17/07/2026'));
    expect(conservationProcess.getTotalSize()).toBe('91187 bytes');
    expect(conservationProcess.getSipCount()).toBe(3);
    expect(conservationProcess.getDocumentsCount()).toBe(2);
    expect(conservationProcess.getFilesCount()).toBe(4);
    expect(conservationProcess.getDocumentClassUuid()).toBe('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
    expect(conservationProcess.getDocumentClassVersion()).toBe('2.1.1');
  });
});
