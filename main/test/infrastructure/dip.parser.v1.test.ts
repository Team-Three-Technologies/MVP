import { describe, it, expect, beforeEach, vi } from 'vitest';
import { container } from 'tsyringe';
import { DipParserV1 } from '../../src/infrastructure/parsing/dip.parser.v1';
import { Buffer } from 'node:buffer';
import * as path from 'node:path';

describe('DipParserV1', () => {
  beforeEach(() => {
    container.clearInstances();
    vi.restoreAllMocks();
  });

  it('parseDipIndex delega a DipIndexParser passando utf8', async () => {
    const dipIndexParser = { parseDipIndex: vi.fn().mockResolvedValue({ ok: true }) };
    const aipInfoParser = { parseAipInfo: vi.fn() };
    const documentMetadataParser = { parseMetadata: vi.fn() };
    const fileSystemProvider = { readFile: vi.fn() };

    const parser = new DipParserV1(
      dipIndexParser as any,
      aipInfoParser as any,
      documentMetadataParser as any,
      fileSystemProvider as any,
    );

    const buf = Buffer.from('<xml>ciao</xml>', 'utf8');
    const res = await parser.parseDipIndex(buf);

    expect(dipIndexParser.parseDipIndex).toHaveBeenCalledTimes(1);
    expect(dipIndexParser.parseDipIndex).toHaveBeenCalledWith('<xml>ciao</xml>');
    expect(res).toEqual({ ok: true });
  });

  it('parseAipInfo delega a AipInfoParser passando utf8', async () => {
    const dipIndexParser = { parseDipIndex: vi.fn() };
    const aipInfoParser = { parseAipInfo: vi.fn().mockResolvedValue({ ok: true }) };
    const documentMetadataParser = { parseMetadata: vi.fn() };
    const fileSystemProvider = { readFile: vi.fn() };

    const parser = new DipParserV1(
      dipIndexParser as any,
      aipInfoParser as any,
      documentMetadataParser as any,
      fileSystemProvider as any,
    );

    const buf = Buffer.from('<aip>info</aip>', 'utf8');
    const res = await parser.parseAipInfo(buf);

    expect(aipInfoParser.parseAipInfo).toHaveBeenCalledTimes(1);
    expect(aipInfoParser.parseAipInfo).toHaveBeenCalledWith('<aip>info</aip>');
    expect(res).toEqual({ ok: true });
  });

  it('parseDocumentsStream emette risultati per ogni documento e legge/parse metadata', async () => {
    const dipIndexParser = { parseDipIndex: vi.fn() };
    const aipInfoParser = { parseAipInfo: vi.fn() };

    const documentMetadataParser = {
      parseMetadata: vi.fn().mockResolvedValue({ parsed: 'meta' }),
    };

    const fileSystemProvider = {
      readFile: vi.fn().mockResolvedValue(Buffer.from('<m/>', 'utf8')),
    };

    const parser = new DipParserV1(
      dipIndexParser as any,
      aipInfoParser as any,
      documentMetadataParser as any,
      fileSystemProvider as any,
    );

    const dipIndex = {
      DiPIndex: {
        PackageContent: {
          DiPDocuments: {
            DocumentClass: [
              {
                AiP: [
                  {
                    '@_uuid': 'aip-1',
                    AiPRoot: 'AIP_ROOT',
                    Document: [
                      {
                        '@_uuid': 'doc-1',
                        DocumentPath: 'DOC_PATH',
                        Files: {
                          Metadata: { '#text': 'metadata.xml' },
                          Primary: { '#text': 'primary.pdf' },
                          Attachments: [
                            { '@_uuid': 'att-1', '#text': 'att1.bin' },
                            { '@_uuid': 'att-2', '#text': 'att2.bin' },
                          ],
                        },
                      },
                      {
                        '@_uuid': 'doc-2',
                        DocumentPath: 'DOC2',
                        Files: {
                          Metadata: { '#text': 'meta2.xml' },
                          Primary: { '#text': 'primary2.pdf' },
                          // Attachments assenti -> []
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    };

    const dir = '/base';

    const results: any[] = [];
    for await (const r of parser.parseDocumentsStream(dipIndex, dir)) {
      results.push(r);
    }

    expect(results).toHaveLength(2);

    const expectedDoc1Path = path.join(dir, 'AIP_ROOT', 'DOC_PATH');
    const expectedDoc1MetadataPath = path.join(expectedDoc1Path, 'metadata.xml');

    const expectedDoc2Path = path.join(dir, 'AIP_ROOT', 'DOC2');
    const expectedDoc2MetadataPath = path.join(expectedDoc2Path, 'meta2.xml');

    // readFile chiamato per entrambi i metadata
    expect(fileSystemProvider.readFile).toHaveBeenCalledTimes(2);
    expect(fileSystemProvider.readFile).toHaveBeenNthCalledWith(1, expectedDoc1MetadataPath);
    expect(fileSystemProvider.readFile).toHaveBeenNthCalledWith(2, expectedDoc2MetadataPath);

    // parseMetadata chiamato per entrambi (string utf8)
    expect(documentMetadataParser.parseMetadata).toHaveBeenCalledTimes(2);
    expect(documentMetadataParser.parseMetadata).toHaveBeenNthCalledWith(1, '<m/>');
    expect(documentMetadataParser.parseMetadata).toHaveBeenNthCalledWith(2, '<m/>');

    expect(results[0]).toEqual({
      uuid: 'doc-1',
      conservationProcessUuid: 'aip-1',
      documentPath: expectedDoc1Path,
      primaryFilePath: 'primary.pdf',
      attachmentsFilesPath: [
        ['att-1', 'att1.bin'],
        ['att-2', 'att2.bin'],
      ],
      documentMetadata: { parsed: 'meta' },
    });

    expect(results[1]).toEqual({
      uuid: 'doc-2',
      conservationProcessUuid: 'aip-1',
      documentPath: expectedDoc2Path,
      primaryFilePath: 'primary2.pdf',
      attachmentsFilesPath: [],
      documentMetadata: { parsed: 'meta' },
    });
  });

  it('parseDocumentsStream propaga errori di readFile/parseMetadata', async () => {
    const dipIndexParser = { parseDipIndex: vi.fn() };
    const aipInfoParser = { parseAipInfo: vi.fn() };

    const documentMetadataParser = {
      parseMetadata: vi.fn(),
    };

    const fileSystemProvider = {
      readFile: vi.fn().mockRejectedValue(new Error('IO error')),
    };

    const parser = new DipParserV1(
      dipIndexParser as any,
      aipInfoParser as any,
      documentMetadataParser as any,
      fileSystemProvider as any,
    );

    const dipIndex = {
      DiPIndex: {
        PackageContent: {
          DiPDocuments: {
            DocumentClass: [
              {
                AiP: [
                  {
                    '@_uuid': 'aip-1',
                    AiPRoot: 'root',
                    Document: [
                      {
                        '@_uuid': 'doc-1',
                        DocumentPath: 'doc',
                        Files: {
                          Metadata: { '#text': 'm.xml' },
                          Primary: { '#text': 'p.pdf' },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    };

    const iter = parser.parseDocumentsStream(dipIndex, '/base');

    await expect(
      (async () => {
        for await (const _ of iter) {
          // no-op
        }
      })(),
    ).rejects.toThrow('IO error');
  });
});
