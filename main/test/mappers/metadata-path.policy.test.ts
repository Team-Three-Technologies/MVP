import { describe, it, expect } from 'vitest';
import { MetadataPathPolicy } from '../../src/mappers/metadata-path.policy';

describe('MetadataPathPolicy', () => {
  describe('policy di default - include()', () => {
    const policy = new MetadataPathPolicy();

    it('include i path che corrispondono ad allowRegex (TotalSize #text/@_unit)', () => {
      expect(
        policy.include('ArchimemoData.DocumentInformation.TotalSize.#text'),
      ).toBe(true);
      expect(
        policy.include('ArchimemoData.DocumentInformation.TotalSize.@_unit'),
      ).toBe(true);
    });

    it('include i path FileSize di FileInformation tramite allowRegex', () => {
      expect(
        policy.include('ArchimemoData.FileInformation.0.FileSize.#text'),
      ).toBe(true);
      expect(
        policy.include('ArchimemoData.FileInformation.12.FileSize.@_unit'),
      ).toBe(true);
    });

    it('include i path MoreData tramite allowRegex', () => {
      expect(policy.include('ArchimemoData.MoreData.0.#text')).toBe(true);
      expect(policy.include('ArchimemoData.MoreData.3.@_name')).toBe(true);
      expect(
        policy.include('ArchimemoData.DocumentInformation.MoreData.1.#text'),
      ).toBe(true);
      expect(
        policy.include('ArchimemoData.FileInformation.0.MoreData.2.@_name'),
      ).toBe(true);
    });

    it('include gli attributi consentiti di FileInformation tramite allowRegex', () => {
      expect(
        policy.include('ArchimemoData.FileInformation.0.@_isPrimary'),
      ).toBe(true);
      expect(
        policy.include('ArchimemoData.FileInformation.1.@_customerHasDeclaredHash'),
      ).toBe(true);
      expect(
        policy.include('ArchimemoData.FileInformation.2.@_originalFileName'),
      ).toBe(true);
    });

    it('esclude i path che contengono attributi @_ tramite denyRegex', () => {
      expect(policy.include('Documento.@_attr')).toBe(false);
      expect(policy.include('@_root')).toBe(false);
    });

    it('esclude i path che terminano con #text tramite denyRegex', () => {
      expect(policy.include('Documento.value.#text')).toBe(false);
    });

    it('da priorità ad allow rispetto a deny quando entrambi corrispondono', () => {
      // questo path corrisponde sia ad allowRegex sia a denyRegex (#text)
      const path = 'ArchimemoData.DocumentInformation.TotalSize.#text';
      expect(policy.include(path)).toBe(true);
    });

    it('restituisce true per path che non corrispondono a nessuna regola (allow di default)', () => {
      expect(policy.include('Documento.Titolo')).toBe(true);
      expect(policy.include('Random.Path.Here')).toBe(true);
    });
  });

  describe('policy di default - utility()', () => {
    const policy = new MetadataPathPolicy();

    it('restituisce true per path che corrispondono a utilityRegex (Soggetti.Ruolo)', () => {
      expect(policy.utility('Documento.Soggetti.Ruolo.0.Persona.Nome')).toBe(true);
      expect(policy.utility('Aaa.Soggetti.Ruolo.5.Bbb.Ccc')).toBe(true);
    });

    it('restituisce false per path che non corrispondono a utilityRegex', () => {
      expect(policy.utility('Documento.Titolo')).toBe(false);
      expect(policy.utility('Soggetti.Ruolo.0')).toBe(false);
    });
  });

  describe('policy personalizzata', () => {
    it('utilizza allowExact personalizzato', () => {
      const policy = new MetadataPathPolicy({
        allowExact: ['my.exact.path'],
        allowRegex: [],
        denyExact: [],
        denyRegex: [/.*/],
        utilityExact: [],
        utilityRegex: [],
      });

      expect(policy.include('my.exact.path')).toBe(true);
      expect(policy.include('other')).toBe(false);
    });

    it('utilizza denyExact personalizzato', () => {
      const policy = new MetadataPathPolicy({
        allowExact: [],
        allowRegex: [],
        denyExact: ['blocked.path'],
        denyRegex: [],
        utilityExact: [],
        utilityRegex: [],
      });

      expect(policy.include('blocked.path')).toBe(false);
      expect(policy.include('allowed.path')).toBe(true);
    });

    it('utilizza utilityExact personalizzato', () => {
      const policy = new MetadataPathPolicy({
        allowExact: [],
        allowRegex: [],
        denyExact: [],
        denyRegex: [],
        utilityExact: ['util.path'],
        utilityRegex: [],
      });

      expect(policy.utility('util.path')).toBe(true);
      expect(policy.utility('not.util')).toBe(false);
    });

    it('utilizza i valori di default quando il costruttore è chiamato senza argomenti', () => {
      const policy = new MetadataPathPolicy(undefined);
      expect(policy.include('Documento.@_attr')).toBe(false);
      expect(policy.utility('A.Soggetti.Ruolo.0.B.C')).toBe(true);
    });
  });
});
