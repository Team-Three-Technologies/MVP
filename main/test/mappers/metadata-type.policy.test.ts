import { describe, it, expect } from 'vitest';
import { MetadataTypePolicy } from '../../src/mappers/metadata-type.policy';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';

describe('MetadataTypePolicy', () => {
  describe('policy di default', () => {
    const policy = new MetadataTypePolicy();

    it('restituisce BOOLEAN per path che corrispondono a booleanRegex (Riservato)', () => {
      expect(policy.type('Documento.Riservato')).toBe(MetadataTypeEnum.BOOLEAN);
    });

    it('restituisce BOOLEAN per path che corrispondono a booleanRegex (Verifica.*)', () => {
      expect(policy.type('Documento.Verifica.Esito')).toBe(MetadataTypeEnum.BOOLEAN);
    });

    it('restituisce NUMBER per il match esatto AggregazioneDocumentaliInformatiche.Progressivo', () => {
      expect(policy.type('AggregazioneDocumentaliInformatiche.Progressivo')).toBe(
        MetadataTypeEnum.NUMBER,
      );
    });

    it('restituisce NUMBER per il match esatto ArchimemoData.DocumentInformation.FilesCount', () => {
      expect(policy.type('ArchimemoData.DocumentInformation.FilesCount')).toBe(
        MetadataTypeEnum.NUMBER,
      );
    });

    it('restituisce NUMBER per path che corrispondono a numberRegex (NumeroAllegati)', () => {
      expect(policy.type('Documento.Allegati.NumeroAllegati')).toBe(MetadataTypeEnum.NUMBER);
    });

    it('restituisce NUMBER per path che corrispondono a numberRegex (TempoDiConservazione)', () => {
      expect(policy.type('Documento.TempoDiConservazione')).toBe(MetadataTypeEnum.NUMBER);
    });

    it('restituisce BASE64 per path che contengono Impronta', () => {
      expect(policy.type('Documento.Impronta')).toBe(MetadataTypeEnum.BASE64);
      expect(policy.type('Impronta.value')).toBe(MetadataTypeEnum.BASE64);
    });

    it('restituisce DATE per path che iniziano con il segmento Data', () => {
      expect(policy.type('Documento.DataCreazione')).toBe(MetadataTypeEnum.DATE);
      expect(policy.type('DataRegistrazione.value')).toBe(MetadataTypeEnum.DATE);
    });

    it('restituisce TIME per path che corrispondono al segmento Ora', () => {
      expect(policy.type('Documento.OraCreazione')).toBe(MetadataTypeEnum.TIME);
      expect(policy.type('OraRegistrazione.value')).toBe(MetadataTypeEnum.TIME);
    });

    it('restituisce STRING come fallback', () => {
      expect(policy.type('Documento.Titolo')).toBe(MetadataTypeEnum.STRING);
      expect(policy.type('Random.Path')).toBe(MetadataTypeEnum.STRING);
      expect(policy.type('')).toBe(MetadataTypeEnum.STRING);
    });

    it('rispetta la precedenza tra tipi (boolean prima di number)', () => {
      // Riservato vince sempre
      expect(policy.type('Test.Riservato')).toBe(MetadataTypeEnum.BOOLEAN);
    });
  });

  describe('policy personalizzata', () => {
    it('utilizza booleanExact personalizzato quando fornito', () => {
      const policy = new MetadataTypePolicy({
        booleanExact: ['my.bool.path'],
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

      expect(policy.type('my.bool.path')).toBe(MetadataTypeEnum.BOOLEAN);
      expect(policy.type('other.path')).toBe(MetadataTypeEnum.STRING);
    });

    it('utilizza numberExact e dateExact personalizzati', () => {
      const policy = new MetadataTypePolicy({
        booleanExact: [],
        booleanRegex: [],
        numberExact: ['count'],
        numberRegex: [],
        base64Exact: [],
        base64Regex: [],
        dateExact: ['birthday'],
        dateRegex: [],
        timeExact: [],
        timeRegex: [],
      });

      expect(policy.type('count')).toBe(MetadataTypeEnum.NUMBER);
      expect(policy.type('birthday')).toBe(MetadataTypeEnum.DATE);
    });

    it('utilizza base64Exact e timeExact personalizzati', () => {
      const policy = new MetadataTypePolicy({
        booleanExact: [],
        booleanRegex: [],
        numberExact: [],
        numberRegex: [],
        base64Exact: ['hash'],
        base64Regex: [],
        dateExact: [],
        dateRegex: [],
        timeExact: ['clock'],
        timeRegex: [],
      });

      expect(policy.type('hash')).toBe(MetadataTypeEnum.BASE64);
      expect(policy.type('clock')).toBe(MetadataTypeEnum.TIME);
    });

    it('ricade sui valori di default quando il costruttore è chiamato senza policy', () => {
      const policy = new MetadataTypePolicy(undefined);
      expect(policy.type('Documento.Riservato')).toBe(MetadataTypeEnum.BOOLEAN);
    });
  });
});
