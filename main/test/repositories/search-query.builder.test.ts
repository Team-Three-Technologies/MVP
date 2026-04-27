import { describe, expect, it } from 'vitest';
import { SearchQueryBuilder } from '../../src/repositories/search-query.builder';
import { MetadataFilter } from '../../src/domain/metadata-filter.model';

describe('SearchQueryBuilder', () => {
  it('withFilter() aggiunge un filtro senza errori', () => {
    const builder = new SearchQueryBuilder();
    builder.withFilter(new MetadataFilter('Tipo', 'abc'));
  });

  describe('buildQuery() - LIKE branch (useFts = false)', () => {
    const clause = String.raw`\(\s*f\.type\s*=\s*\?\s*AND\s+m\.valore\s+LIKE\s*\?\s*\)`;
    const queryRegex = new RegExp(
      String.raw`SELECT\s+m\.uuid_documento\s+FROM\s+metadata\s+m\s+JOIN\s+metadata_filter_match\s+f\s+ON\s+m\.nome\s+LIKE\s+f\.nome_pattern\s+WHERE\s+${clause}(\s+OR\s+${clause})*\s+GROUP\s+BY\s+m\.uuid_documento\s+HAVING\s+COUNT\s*\(\s*DISTINCT\s+f\.type\s*\)\s*=\s*\?\s*;`,
      'i',
    );

    it('costruisce query con una clausola', () => {
      const builder = new SearchQueryBuilder();
      builder.withFilter(new MetadataFilter('Formato', 'ab'));

      const { query, params } = builder.buildQuery();

      expect(queryRegex.test(query)).toBe(true);
      expect(params).toEqual(['Formato', '%ab%', 1]);
    });

    it('costruisce query con N clausole', () => {
      const builder = new SearchQueryBuilder();
      builder.withFilter(new MetadataFilter('Formato', 'ab'));
      builder.withFilter(new MetadataFilter('Tipo', 'cd'));

      const { query, params } = builder.buildQuery();

      expect(queryRegex.test(query)).toBe(true);
      expect(params).toEqual([
        'Formato', '%ab%',
        'Tipo', '%cd%',
        2,
      ]);
    });
  });

  describe('buildQuery() - FTS branch (useFts = true)', () => {
    const clause = String.raw`\(\s*f\.type\s*=\s*\?\s*AND\s+fts\.valore\s+MATCH\s*\?\s*\)`;
    const queryRegex = new RegExp(
      String.raw`SELECT\s+fts\.uuid_documento\s+FROM\s+metadata_fts\s+fts\s+JOIN\s+metadata_filter_match\s+f\s+ON\s+fts\.nome\s+LIKE\s+f\.nome_pattern\s+WHERE\s+${clause}(\s+OR\s+${clause})*\s+GROUP\s+BY\s+fts\.uuid_documento\s+HAVING\s+COUNT\s*\(\s*DISTINCT\s+f\.type\s*\)\s*=\s*\?\s*;`,
      'i',
    );

    it('usa FTS quando tutte le stringhe hanno lunghezza >= 3', () => {
      const builder = new SearchQueryBuilder();
      builder.withFilter(new MetadataFilter('Formato', 'pdf'));
      builder.withFilter(new MetadataFilter('Note', 'testo'));

      const { query, params } = builder.buildQuery();

      expect(queryRegex.test(query)).toBe(true);
      expect(params).toEqual([
        'Formato', 'pdf',
        'Note', 'testo',
        2,
      ]);
    });
  });

  describe('buildQuery() edge cases', () => {
    it('ritorna query invalida (senza clausole)', () => {
      const builder = new SearchQueryBuilder();
      const { query, params } = builder.buildQuery();

      expect(query).toContain('WHERE');
      expect(params).toEqual([0]);
    });

    it('resetta i filtri dopo buildQuery()', () => {
      const builder = new SearchQueryBuilder();
      builder.withFilter(new MetadataFilter('Formato', 'ab'));

      builder.buildQuery();
      const result = builder.buildQuery();

      expect(result.params).toEqual([0]);
    });
  });
});