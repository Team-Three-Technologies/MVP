import { describe, it, expect } from 'vitest';
import { MetadataFlattener } from '../../src/mappers/metadata.flattener';
import { MetadataPathPolicy } from '../../src/mappers/metadata-path.policy';
import { MetadataTypePolicy } from '../../src/mappers/metadata-type.policy';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';

describe('MetadataFlattener', () => {
  describe('flattening di base', () => {
    it('appiattisce un oggetto semplice con foglie di tipo stringa', () => {
      const flattener = new MetadataFlattener();
      const result = flattener.flatten({
        Documento: {
          Titolo: 'foo',
          Autore: 'bar',
        },
      });

      expect(result).toHaveLength(2);
      expect(result[0].getName()).toBe('Documento.Titolo');
      expect(result[0].getValue()).toBe('foo');
      expect(result[0].getType()).toBe(MetadataTypeEnum.STRING);
      expect(result[1].getName()).toBe('Documento.Autore');
      expect(result[1].getValue()).toBe('bar');
    });

    it('ignora i valori undefined', () => {
      const flattener = new MetadataFlattener();
      const result = flattener.flatten({
        Documento: {
          Titolo: 'foo',
          Skip: undefined,
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].getName()).toBe('Documento.Titolo');
    });

    it('ignora i valori null', () => {
      const flattener = new MetadataFlattener();
      const result = flattener.flatten({
        Documento: {
          Titolo: 'foo',
          Skip: null,
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].getName()).toBe('Documento.Titolo');
    });

    it('converte numeri e booleani in valori stringa', () => {
      const flattener = new MetadataFlattener();
      const result = flattener.flatten({
        n: 42,
        b: true,
      });

      expect(result).toHaveLength(2);
      expect(result[0].getValue()).toBe('42');
      expect(result[1].getValue()).toBe('true');
    });

    it('gestisce gli array indicizzandoli', () => {
      const flattener = new MetadataFlattener();
      const result = flattener.flatten({
        items: ['a', 'b', 'c'],
      });

      expect(result).toHaveLength(3);
      expect(result[0].getName()).toBe('items.0');
      expect(result[1].getName()).toBe('items.1');
      expect(result[2].getName()).toBe('items.2');
    });

    it('gestisce array annidati di oggetti', () => {
      const flattener = new MetadataFlattener();
      const result = flattener.flatten({
        list: [{ name: 'a' }, { name: 'b' }],
      });

      expect(result).toHaveLength(2);
      expect(result[0].getName()).toBe('list.0.name');
      expect(result[1].getName()).toBe('list.1.name');
    });

    it('utilizza rootPath come prefisso quando fornito', () => {
      const flattener = new MetadataFlattener();
      const result = flattener.flatten({ a: 'x' }, 'Root');

      expect(result[0].getName()).toBe('Root.a');
    });

    it('gestisce un oggetto vuoto', () => {
      const flattener = new MetadataFlattener();
      expect(flattener.flatten({})).toEqual([]);
    });

    it('gestisce array al primo livello con rootPath vuoto', () => {
      const flattener = new MetadataFlattener();
      // root è un Record, ma testiamo array innestato a primo livello via key vuota
      const result = flattener.flatten({ '': ['x', 'y'] } as Record<string, unknown>);
      // path dei figli è "0", "1" perché path è '' (falsy) all'avvio del visit dell'array
      expect(result).toHaveLength(2);
    });
  });

  describe('integrazione con le policy', () => {
    it('applica correttamente la type policy (default)', () => {
      const flattener = new MetadataFlattener();
      const result = flattener.flatten({
        Documento: {
          Riservato: false,
          DataCreazione: '2024-01-01',
          OraCreazione: '12:00',
          Impronta: 'abc==',
          Titolo: 'foo',
        },
        AggregazioneDocumentaliInformatiche: {
          Progressivo: 7,
        },
      });

      const byName = Object.fromEntries(result.map((m) => [m.getName(), m]));

      expect(byName['Documento.Riservato'].getType()).toBe(MetadataTypeEnum.BOOLEAN);
      expect(byName['Documento.DataCreazione'].getType()).toBe(MetadataTypeEnum.DATE);
      expect(byName['Documento.OraCreazione'].getType()).toBe(MetadataTypeEnum.TIME);
      expect(byName['Documento.Impronta'].getType()).toBe(MetadataTypeEnum.BASE64);
      expect(byName['Documento.Titolo'].getType()).toBe(MetadataTypeEnum.STRING);
      expect(byName['AggregazioneDocumentaliInformatiche.Progressivo'].getType()).toBe(
        MetadataTypeEnum.NUMBER,
      );
    });

    it('applica la path policy: esclude le foglie negate', () => {
      const flattener = new MetadataFlattener();
      const result = flattener.flatten({
        Documento: {
          '@_attr': 'denied',
          Titolo: 'allowed',
        },
      });

      expect(result).toHaveLength(1);
      expect(result[0].getName()).toBe('Documento.Titolo');
    });

    it('applica la path policy: mantiene gli attributi in allowlist (allow > deny)', () => {
      const flattener = new MetadataFlattener();
      const result = flattener.flatten({
        ArchimemoData: {
          DocumentInformation: {
            TotalSize: {
              '#text': '1024',
              '@_unit': 'B',
            },
          },
        },
      });

      const names = result.map((m) => m.getName());
      expect(names).toContain('ArchimemoData.DocumentInformation.TotalSize.#text');
      expect(names).toContain('ArchimemoData.DocumentInformation.TotalSize.@_unit');
    });

    describe('policy personalizzate tramite costruttore', () => {
      it('utilizza la path policy personalizzata iniettata', () => {
        const pathPolicy = new MetadataPathPolicy({
          allowExact: [],
          allowRegex: [],
          denyExact: ['Documento.Titolo'],
          denyRegex: [],
          utilityExact: [],
          utilityRegex: [],
        });
        const flattener = new MetadataFlattener(pathPolicy);

        const result = flattener.flatten({
          Documento: {
            Titolo: 'blocked',
            Autore: 'kept',
          },
        });

        expect(result).toHaveLength(1);
        expect(result[0].getName()).toBe('Documento.Autore');
      });

      it('utilizza la type policy personalizzata iniettata', () => {
        const typePolicy = new MetadataTypePolicy({
          booleanExact: ['Documento.Flag'],
          booleanRegex: [],
          numberExact: [],
          numberRegex: [],
          base64Exact: [],
          base64Regex: [],
          dateExact: [],
          dateRegex: [],
          timeExact: [],
          timeRegex: [],
        });
        const flattener = new MetadataFlattener(undefined, typePolicy);

        const result = flattener.flatten({
          Documento: { Flag: 'true' },
        });

        expect(result[0].getType()).toBe(MetadataTypeEnum.BOOLEAN);
      });
    });
  });
});
