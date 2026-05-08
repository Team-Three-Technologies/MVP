import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { DocumentMetadataParserV1 } from '../../src/infrastructure/parsing/document-metadata.parser.v1';

describe('DocumentMetadataParserV1', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('lancia errore se XML non valido', async () => {
    const parser = new DocumentMetadataParserV1();
    await expect(parser.parseMetadata('<Document><bad></Document>')).rejects.toThrow(
      /DocumentMetadata XML non valido:/,
    );
  });

  it('lancia errore se manca elemento Document', async () => {
    const parser = new DocumentMetadataParserV1();
    await expect(parser.parseMetadata('<Root></Root>')).rejects.toThrow(
      'Elemento Document mancante',
    );
  });

  it('ritorna oggetto parsato quando XML valido e contiene Document', async () => {
    const parser = new DocumentMetadataParserV1();
    const xml = `
      <Document>
        <Id>123</Id>
      </Document>
    `;
    const res = await parser.parseMetadata(xml);
    expect(res).toHaveProperty('Document');
  });

  it('config isArray: ParoleChiave viene parsato come array anche con una sola occorrenza', async () => {
    const parser = new DocumentMetadataParserV1();
    const xml = `
      <Document>
        <ParoleChiave>uno</ParoleChiave>
      </Document>
    `;
    const res = await parser.parseMetadata(xml);

    // Se questa assertion fallisce, significa che l'XML effettivo che ricevi ha una struttura diversa
    // (es. ParoleChiave come wrapper con figli). In quel caso va aggiornato il test in base allo schema reale.
    expect(Array.isArray(res.Document.ParoleChiave)).toBe(true);
    expect(res.Document.ParoleChiave).toEqual(['uno']);
  });

  it('config isArray: FileInformation viene parsato come array anche con una sola occorrenza', async () => {
    const parser = new DocumentMetadataParserV1();
    const xml = `
      <Document>
        <FileInformation>
          <Nome>file.txt</Nome>
        </FileInformation>
      </Document>
    `;
    const res = await parser.parseMetadata(xml);

    expect(Array.isArray(res.Document.FileInformation)).toBe(true);
    expect(res.Document.FileInformation).toHaveLength(1);
    expect(res.Document.FileInformation[0]).toHaveProperty('Nome', 'file.txt');
  });
});
