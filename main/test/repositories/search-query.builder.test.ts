import { describe, expect, it } from 'vitest';
import { SearchQueryBuilder } from '../../src/repositories/search-query.builder';
import { MetadataFilter } from '../../src/domain/metadata-filter.model';

describe('SearchQueryBuilder', () => {
  it('withFilter()', () => {
    const builder = new SearchQueryBuilder();
    builder.withFilter(new MetadataFilter('', ''));
  });

  describe('withFilter()', () => {
    const clause = String.raw`\(\s*f\.type\s*=\s*\?\s*AND\s+m\.valore\s*=\s*\?\s*\)`;
    const queryRegex = new RegExp(
      String.raw`^\s*SELECT\s+uuid_documento\s+FROM\s+metadata\s+m\s+JOIN\s+metadata_filter_match\s+f\s+ON\s+m\.nome\s+LIKE\s+f\.nome_pattern\s+WHERE\s+${clause}(\s+OR\s+${clause})*\s+GROUP\s+BY\s+uuid_documento\s+HAVING\s+COUNT\s*\(\s*DISTINCT\s+f\.type\s*\)\s*=\s*\?\s*;\s*$`,
      'i',
    );

    it('riconosce una sola clausola', () => {
      const builder = new SearchQueryBuilder();
      builder.withFilter(new MetadataFilter('Formato', '.pdf'));
      const query = builder.buildQuery().query;
      expect(queryRegex.test(query)).toBe(true);
    });

    it('riconosce N clausole separate da OR', () => {
      const builder = new SearchQueryBuilder();
      builder.withFilter(new MetadataFilter('Formato', '.pdf'));
      builder.withFilter(new MetadataFilter('Tipo soggetto', 'AS'));
      builder.withFilter(new MetadataFilter('Note', 'nota random'));
      const query = builder.buildQuery().query;
      expect(queryRegex.test(query)).toBe(true);
    });

    it('rifiuta query senza clausole', () => {
      const builder = new SearchQueryBuilder();
      const query = builder.buildQuery().query;
      expect(queryRegex.test(query)).toBe(false);
    });
  });
});
