import 'reflect-metadata';
import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { DipMapper } from '../../src/mappers/dip.mapper';
import { Dip } from '../../src/domain/dip.model';

describe('DipMapper', () => {
  let mapper: DipMapper;

  beforeEach(() => {
    container.clearInstances();
    mapper = container.resolve(DipMapper);
  });

  it('dovrebbe mappare correttamente tutti i campi in una istanza di Dip', () => {
    const packageInfo = {
      ProcessUUID: 'dip-uuid-001',
      CreationDate: '2024-03-10T08:00:00Z',
      DocumentsCount: '15',
      AiPCount: '3',
    };

    const result = mapper.toDomain(packageInfo);

    expect(result).toBeInstanceOf(Dip);
    expect(result.getProcessUuid()).toBe('dip-uuid-001');
    expect(result.getCreationDate()).toEqual(new Date('2024-03-10T08:00:00Z'));
    expect(result.getDocumentsCount()).toBe(15);
    expect(result.getAipCount()).toBe(3);
  });

  it('dovrebbe convertire le stringhe numeriche dei contatori in numeri', () => {
    const packageInfo = {
      ProcessUUID: 'uuid',
      CreationDate: '2024-01-01',
      DocumentsCount: '100',
      AiPCount: '50',
    };
    const result = mapper.toDomain(packageInfo);
    expect(typeof result.getDocumentsCount()).toBe('number');
    expect(typeof result.getAipCount()).toBe('number');
  });

  it('dovrebbe accettare contatori già numerici', () => {
    const packageInfo = {
      ProcessUUID: 'uuid',
      CreationDate: '2024-01-01',
      DocumentsCount: 7,
      AiPCount: 2,
    };
    const result = mapper.toDomain(packageInfo);
    expect(result.getDocumentsCount()).toBe(7);
    expect(result.getAipCount()).toBe(2);
  });

  it('dovrebbe produrre NaN quando i contatori non sono numerici', () => {
    const packageInfo = {
      ProcessUUID: 'uuid',
      CreationDate: '2024-01-01',
      DocumentsCount: 'abc',
      AiPCount: 'xyz',
    };
    const result = mapper.toDomain(packageInfo);
    expect(result.getDocumentsCount()).toBeNaN();
    expect(result.getAipCount()).toBeNaN();
  });

  it('dovrebbe produrre una Data non valida quando CreationDate è mancante', () => {
    const packageInfo = {
      ProcessUUID: 'uuid',
      CreationDate: undefined,
      DocumentsCount: '1',
      AiPCount: '1',
    };
    const result = mapper.toDomain(packageInfo);
    expect(result.getCreationDate().toString()).toBe('Invalid Date');
  });
});
