import { MetadataFilter } from '../domain/metadata-filter.model';

export interface SearchQueryBuilderResult {
  query: string;
  params: (string | number)[];
}

export class SearchQueryBuilder {
  private filters: MetadataFilter[] = [];

  public withFilter(filter: MetadataFilter): void {
    this.filters.push(filter);
  }

  public buildQuery(): SearchQueryBuilderResult {
    const useFts = this.filters.length > 0 && this.filters.every((f) => f.getValue().length >= 3);

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (useFts) {
      for (const filter of this.filters) {
        conditions.push(`(f.type = ? AND fts.valore MATCH ?)`);
        params.push(filter.getType(), filter.getValue());
      }

      const query = `
        SELECT fts.uuid_documento
        FROM metadata_fts fts
        JOIN metadata_filter_match f ON fts.nome LIKE f.nome_pattern
        WHERE ${conditions.join(' OR ')}
        GROUP BY fts.uuid_documento
        HAVING COUNT(DISTINCT f.type) = ?;
      `;
      params.push(this.filters.length);
      this.filters = [];
      return { query, params };
    }

    for (const filter of this.filters) {
      conditions.push(`(f.type = ? AND m.valore LIKE ?)`);
      params.push(filter.getType(), `%${filter.getValue()}%`);
    }

    const query = `
      SELECT m.uuid_documento
      FROM metadata m
      JOIN metadata_filter_match f ON m.nome LIKE f.nome_pattern
      WHERE ${conditions.join(' OR ')}
      GROUP BY m.uuid_documento
      HAVING COUNT(DISTINCT f.type) = ?;
    `;
    params.push(this.filters.length);
    this.filters = [];
    return { query, params };
  }
}
