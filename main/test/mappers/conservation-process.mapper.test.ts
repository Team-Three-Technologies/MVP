import 'reflect-metadata';
import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { ConservationProcessMapper } from '../../src/mappers/conservation-process.mapper';
import { ConservationProcess } from '../../src/domain/conservation-process.model';

describe('ConservationProcessMapper', () => {
  let mapper: ConservationProcessMapper;

  beforeEach(() => {
    container.clearInstances();
    mapper = container.resolve(ConservationProcessMapper);
  });

  const buildXml = (overrides: Partial<any> = {}) => ({
    AiPInfo: {
      Process: {
        '@_ark-aip:uuid': 'process-uuid-123',
        Start: { Date: '2024-01-15T10:30:00Z' },
        PreservationSession: {
          DocumentsStats: {
            DocumentsOverallSize: { '#text': '1024', '@_ark-aip:unit': 'MB' },
            SipCount: '5',
            DocumentsCount: '20',
            DocumentsFilesCount: '40',
          },
        },
        DocumentClass: {
          '@_ark-aip:uuid': 'doc-class-uuid-456',
          Version: '1.0.0',
        },
        ...overrides,
      },
    },
  });

  it('dovrebbe mappare correttamente tutti i campi in una istanza di ConservationProcess', () => {
    const result = mapper.toDomain(buildXml());

    expect(result).toBeInstanceOf(ConservationProcess);
    expect(result.getUuid()).toBe('process-uuid-123');
    expect(result.getCreationDate()).toEqual(new Date('2024-01-15T10:30:00Z'));
    expect(result.getTotalSize()).toBe('1024 MB');
    expect(result.getSipCount()).toBe(5);
    expect(result.getDocumentsCount()).toBe(20);
    expect(result.getFilesCount()).toBe(40);
    expect(result.getDocumentClassUuid()).toBe('doc-class-uuid-456');
    expect(result.getDocumentClassVersion()).toBe('1.0.0');
  });

  it('dovrebbe convertire le stringhe numeriche in numeri', () => {
    const result = mapper.toDomain(buildXml());
    expect(typeof result.getSipCount()).toBe('number');
    expect(typeof result.getDocumentsCount()).toBe('number');
    expect(typeof result.getFilesCount()).toBe('number');
  });

  it('dovrebbe gestire size senza testo e unità producendo una stringa vuota', () => {
    const xml = buildXml();
    xml.AiPInfo.Process.PreservationSession.DocumentsStats.DocumentsOverallSize = {};
    const result = mapper.toDomain(xml);
    expect(result.getTotalSize()).toBe('');
  });

  it('dovrebbe gestire la sola unità di size mancante', () => {
    const xml = buildXml();
    xml.AiPInfo.Process.PreservationSession.DocumentsStats.DocumentsOverallSize = {
      '#text': '500',
    };
    const result = mapper.toDomain(xml);
    expect(result.getTotalSize()).toBe('500');
  });

  it('dovrebbe produrre NaN quando i campi count non sono numerici', () => {
    const xml = buildXml();
    xml.AiPInfo.Process.PreservationSession.DocumentsStats.SipCount = 'not-a-number';
    const result = mapper.toDomain(xml);
    expect(result.getSipCount()).toBeNaN();
  });

  it('dovrebbe produrre una Data non valida quando la data di inizio è mancante', () => {
    const xml = buildXml();
    xml.AiPInfo.Process.Start = { Date: undefined };
    const result = mapper.toDomain(xml);
    expect(result.getCreationDate().toString()).toBe('Invalid Date');
  });
});
