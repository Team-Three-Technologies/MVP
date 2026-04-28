import 'reflect-metadata';
import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { DocumentClassMapper } from '../../src/mappers/document-class.mapper';
import { DocumentClass } from '../../src/domain/document-class.model';

describe('DocumentClassMapper', () => {
  let mapper: DocumentClassMapper;

  beforeEach(() => {
    container.clearInstances();
    mapper = container.resolve(DocumentClassMapper);
  });

  it('dovrebbe mappare correttamente tutti i campi quando validTo è presente', () => {
    const xml = {
      '@_uuid': 'class-uuid-1',
      '@_name': 'Fatture',
      '@_version': '2.0',
      '@_validFrom': '2023-01-01T00:00:00Z',
      '@_validTo': '2025-12-31T23:59:59Z',
    };

    const result = mapper.toDomain(xml, 'dip-uuid-1');

    expect(result).toBeInstanceOf(DocumentClass);
    expect(result.getUuid()).toBe('class-uuid-1');
    expect(result.getName()).toBe('Fatture');
    expect(result.getVersion()).toBe('2.0');
    expect(result.getValidFrom()).toEqual(new Date('2023-01-01T00:00:00Z'));
    expect(result.getValidTo()).toEqual(new Date('2025-12-31T23:59:59Z'));
    expect(result.getDipUuid()).toBe('dip-uuid-1');
  });

  it('dovrebbe impostare validTo a undefined quando non fornito', () => {
    const xml = {
      '@_uuid': 'class-uuid-2',
      '@_name': 'Contratti',
      '@_version': '1.0',
      '@_validFrom': '2023-01-01T00:00:00Z',
    };

    const result = mapper.toDomain(xml, 'dip-uuid-2');
    expect(result.getValidTo()).toBeUndefined();
  });

  it('dovrebbe impostare validTo a undefined quando esplicitamente vuoto', () => {
    const xml = {
      '@_uuid': 'class-uuid-3',
      '@_name': 'X',
      '@_version': '1',
      '@_validFrom': '2023-01-01T00:00:00Z',
      '@_validTo': '',
    };

    const result = mapper.toDomain(xml, 'dip-uuid-3');
    expect(result.getValidTo()).toBeUndefined();
  });

  it('dovrebbe associare il dipUuid passato come secondo argomento', () => {
    const xml = {
      '@_uuid': 'u',
      '@_name': 'n',
      '@_version': 'v',
      '@_validFrom': '2024-01-01',
    };
    const result = mapper.toDomain(xml, 'specific-dip-uuid');
    expect(result.getDipUuid()).toBe('specific-dip-uuid');
  });

  it('dovrebbe produrre una Data non valida quando validFrom è mancante', () => {
    const xml = {
      '@_uuid': 'u',
      '@_name': 'n',
      '@_version': 'v',
      '@_validFrom': undefined,
    };
    const result = mapper.toDomain(xml, 'dip');
    expect(result.getValidFrom().toString()).toBe('Invalid Date');
  });
});
