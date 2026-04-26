import { MetadataFilter } from '../../src/domain/metadata-filter.model';
import { describe, expect, it } from 'vitest';

describe('Test di metadata-filter',()=>{
    it('test dei getter e setter',()=>{
        let metadata = new MetadataFilter('Formato','.pdf');

        metadata.setType('Tipo soggetto');
        metadata.setValue('AS');

        expect(metadata.getType()).toBe('Tipo soggetto');
        expect(metadata.getValue()).toBe('AS');

    });
    
});

