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
    let query = `
      SELECT uuid_documento 
      FROM metadata m
      JOIN metadata_filter_match f ON m.nome LIKE f.nome_pattern
    `;

    const conditions: string[] = [];
    const params: (string | number)[] = [];

    for (const filter of this.filters) {
      conditions.push(`(f.type = ? AND m.valore = ?)`);
      params.push(filter.getType(), filter.getValue());
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' OR ');
      query += ` 
        GROUP BY uuid_documento
        HAVING COUNT(DISTINCT f.type) = ?;
      `;
      params.push(this.filters.length);
    }

    return { query: query, params: params };
  }
}
