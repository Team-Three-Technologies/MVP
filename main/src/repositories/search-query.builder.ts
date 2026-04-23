import {SearchFilterDTO} from '../../../shared/request/search-filter.request.dto';
export class SearchQueryBuilder{

    private filters:SearchFilterDTO[]=[];

    public addFilter(filter: SearchFilterDTO):void
    {
        this.filters.push(filter);
    }

    public getResult():string
    {
        //Costruzione query sulla tabella metadata
        let remainingFilters=this.filters.length;
        let query = `SELECT uuid_documento AS uuid_document
                    FROM metadata m JOIN metadata_filter_match f ON m.nome LIKE f.nome_pattern
                    WHERE `;
        if(remainingFilters!==0)
        {
            for(const filter of this.filters)
                {
                    remainingFilters--;
                    query.concat(`(f.type='${filter.type}' AND m.valore='${filter.value}')`);

                    if(remainingFilters!==0)
                        query.concat(` OR `);
                }
                query.concat(` GROUP BY uuid_documento
                               HAVING COUNT(DISTINCT f.type)=${this.filters.length}`);
        }
       
        return query;
    }
}
