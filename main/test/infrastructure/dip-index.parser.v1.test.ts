import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { DipIndexParserV1 } from '../../src/infrastructure/parsing/dip-index.parser.v1';

const baseXml = (inner: string) => `
<DiPIndex>
  <PackageInfo><Dummy/></PackageInfo>
  <PackageContent>
    <DiPDocuments>
      ${inner}
    </DiPDocuments>
  </PackageContent>
</DiPIndex>
`;

describe('DipIndexParserV1', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('lancia errore se XML non valido', async () => {
    const parser = new DipIndexParserV1();
    await expect(parser.parseDipIndex('<DiPIndex><bad></DiPIndex>')).rejects.toThrow(
      /DiPIndex XML non valido/,
    );
  });

  it('lancia errore se manca DiPIndex', async () => {
    const parser = new DipIndexParserV1();
    await expect(parser.parseDipIndex('<Root></Root>')).rejects.toThrow(
      'Elemento DiPIndex mancante',
    );
  });

  it('lancia errore se manca PackageContent/DiPDocuments', async () => {
    const parser = new DipIndexParserV1();
    const xml = `<DiPIndex><PackageInfo><Dummy/></PackageInfo></DiPIndex>`;
    await expect(parser.parseDipIndex(xml)).rejects.toThrow(
      'Elemento "PackageContent/DiPDocuments" mancante',
    );
  });

  it('lancia errore se DocumentClass è mancante o vuoto', async () => {
    const parser = new DipIndexParserV1();
    const xml = `
    <DiPIndex>
      <PackageInfo><Dummy/></PackageInfo>
      <PackageContent>
        <DiPDocuments><Dummy/></DiPDocuments>
      </PackageContent>
    </DiPIndex>`;
    await expect(parser.parseDipIndex(xml)).rejects.toThrow(
      '"PackageContent/DiPDocuments/DocumentClass" mancante o vuoto',
    );
  });

  it('lancia errore se manca un attributo obbligatorio in DocumentClass', async () => {
    const parser = new DipIndexParserV1();
    const xml = baseXml(`
      <DocumentClass uuid="dc1" name="Name" version="1.0">
        <AiP uuid="a1">
          <Document uuid="d1">
            <DocumentPath>path</DocumentPath>
            <Files><Metadata>m</Metadata><Primary>p</Primary></Files>
          </Document>
        </AiP>
      </DocumentClass>
    `);
    await expect(parser.parseDipIndex(xml)).rejects.toThrow(
      'Attributi obbligatori mancanti in DocumentClass (uuid, name, version, validFrom)',
    );
  });

  it('lancia errore se DocumentClass non ha AiP', async () => {
    const parser = new DipIndexParserV1();
    const xml = baseXml(`
      <DocumentClass uuid="dc1" name="Name" version="1.0" validFrom="2024-01-01"></DocumentClass>
    `);
    await expect(parser.parseDipIndex(xml)).rejects.toThrow('DocumentClass dc1 senza elementi AiP');
  });

  it('lancia errore se AiP senza uuid', async () => {
    const parser = new DipIndexParserV1();
    const xml = baseXml(`
      <DocumentClass uuid="dc1" name="Name" version="1.0" validFrom="2024-01-01">
        <AiP>
          <Document uuid="d1">
            <DocumentPath>path</DocumentPath>
            <Files><Metadata>m</Metadata><Primary>p</Primary></Files>
          </Document>
        </AiP>
      </DocumentClass>
    `);
    await expect(parser.parseDipIndex(xml)).rejects.toThrow(
      'Attributo obbligatorio "@_uuid" mancante in AiP',
    );
  });

  it('lancia errore se AiP senza Document', async () => {
    const parser = new DipIndexParserV1();
    const xml = baseXml(`
      <DocumentClass uuid="dc1" name="Name" version="1.0" validFrom="2024-01-01">
        <AiP uuid="a1"></AiP>
      </DocumentClass>
    `);
    await expect(parser.parseDipIndex(xml)).rejects.toThrow('AiP a1 senza elementi Document');
  });

  it('lancia errore se Document senza uuid', async () => {
    const parser = new DipIndexParserV1();
    const xml = baseXml(`
      <DocumentClass uuid="dc1" name="Name" version="1.0" validFrom="2024-01-01">
        <AiP uuid="a1">
          <Document>
            <DocumentPath>path</DocumentPath>
            <Files><Metadata>m</Metadata><Primary>p</Primary></Files>
          </Document>
        </AiP>
      </DocumentClass>
    `);
    await expect(parser.parseDipIndex(xml)).rejects.toThrow(
      'Attributo obbligatorio "@_uuid" mancante in Document',
    );
  });

  it('lancia errore se manca DocumentPath', async () => {
    const parser = new DipIndexParserV1();
    const xml = baseXml(`
      <DocumentClass uuid="dc1" name="Name" version="1.0" validFrom="2024-01-01">
        <AiP uuid="a1">
          <Document uuid="d1">
            <Files><Metadata>m</Metadata><Primary>p</Primary></Files>
          </Document>
        </AiP>
      </DocumentClass>
    `);
    await expect(parser.parseDipIndex(xml)).rejects.toThrow('Document d1 senza DocumentPath');
  });

  it('lancia errore se mancano Files/Metadata o Files/Primary', async () => {
    const parser = new DipIndexParserV1();
    const xml = baseXml(`
      <DocumentClass uuid="dc1" name="Name" version="1.0" validFrom="2024-01-01">
        <AiP uuid="a1">
          <Document uuid="d1">
            <DocumentPath>path</DocumentPath>
            <Files><Metadata>m</Metadata></Files>
          </Document>
        </AiP>
      </DocumentClass>
    `);
    await expect(parser.parseDipIndex(xml)).rejects.toThrow(
      'Document d1 senza Files/Metadata o Files/Primary',
    );
  });

  it('ritorna oggetto parsato quando XML valido', async () => {
    const parser = new DipIndexParserV1();
    const xml = baseXml(`
      <DocumentClass uuid="dc1" name="Name" version="1.0" validFrom="2024-01-01">
        <AiP uuid="a1">
          <Document uuid="d1">
            <DocumentPath>path</DocumentPath>
            <Files><Metadata>m</Metadata><Primary>p</Primary></Files>
          </Document>
        </AiP>
      </DocumentClass>
    `);
    const res = await parser.parseDipIndex(xml);
    expect(res).toHaveProperty('DiPIndex');
  });
});
