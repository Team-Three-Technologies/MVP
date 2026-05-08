import { describe, it, expect, beforeEach } from 'vitest';
import { container } from 'tsyringe';
import { AipInfoParserV1 } from '../../src/infrastructure/parsing/aip-info.parser.v1';

describe('AipInfoParserV1', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('lancia errore se XML non valido', async () => {
    const parser = new AipInfoParserV1();
    await expect(parser.parseAipInfo('<AiPInfo><bad></AiPInfo>')).rejects.toThrow(
      /AiPInfo XML non valido:/,
    );
  });

  it('lancia errore se manca elemento AiPInfo', async () => {
    const parser = new AipInfoParserV1();
    await expect(parser.parseAipInfo('<Root></Root>')).rejects.toThrow('Elemento AiPInfo mancante');
  });

  it('ritorna oggetto parsato quando XML valido e contiene AiPInfo', async () => {
    const parser = new AipInfoParserV1();
    const xml = `
      <AiPInfo>
        <Id>123</Id>
      </AiPInfo>
    `;
    const res = await parser.parseAipInfo(xml);
    expect(res).toHaveProperty('AiPInfo');
  });

  it('config isArray: SubmissionSession viene parsato come array anche con una sola occorrenza', async () => {
    const parser = new AipInfoParserV1();
    const xml = `
      <AiPInfo>
        <SubmissionSession>
          <Id>SS1</Id>
        </SubmissionSession>
      </AiPInfo>
    `;
    const res = await parser.parseAipInfo(xml);

    expect(Array.isArray(res.AiPInfo.SubmissionSession)).toBe(true);
    expect(res.AiPInfo.SubmissionSession).toHaveLength(1);
    expect(res.AiPInfo.SubmissionSession[0]).toHaveProperty('Id', 'SS1');
  });

  it('config isArray: MIMEType viene parsato come array anche con una sola occorrenza', async () => {
    const parser = new AipInfoParserV1();
    const xml = `
      <AiPInfo>
        <MIMEType>application/pdf</MIMEType>
      </AiPInfo>
    `;
    const res = await parser.parseAipInfo(xml);

    expect(Array.isArray(res.AiPInfo.MIMEType)).toBe(true);
    expect(res.AiPInfo.MIMEType).toEqual(['application/pdf']);
  });
});
