import { container } from 'tsyringe';
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';

import { SQLiteDocumentRepository } from '../../src/repositories/document.repository.sqlite';
import { Document  } from '../../src/domain/document.model';
import { File  } from '../../src/domain/file.model';
import { Metadata  } from '../../src/domain/metadata.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum';
import { SearchFilterDTO} from '../../../shared/request/search.request.dto'
import { MetadataFilter } from '../../src/domain/metadata-filter.model';

describe('Test SQLiteDocumentRepository', ()=>{
    beforeEach(()=>{
        container.clearInstances();
        container.register(TOKENS.DatabaseProvider, { useValue: {} });
        container.register(TOKENS.SearchQueryBuilder, { useValue: {} });
    });

    it('save(document), se avviene con successo restituisce la document passata', async ()=>{

        const mockContainer ={
            prepare : vi.fn().mockReturnValue({
                run:vi.fn()}),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };
        container.register(TOKENS.DatabaseProvider, {useValue: mockDatabaseProvider});
        container.register(TOKENS.SearchQueryBuilder,{
            useValue:{
                withFilter: vi.fn(),
            }
        });

        const doc = container.resolve(SQLiteDocumentRepository);

        const result = await doc
            .save(new Document(
                'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                'path',
                new File('','',''),
                [new File('','','')],
                [new Metadata('','',MetadataTypeEnum.DATE)],
                ''
            ));

        expect(result).toBeInstanceOf(Document);

    });

    it('findMainFileByDocumentUuid(string)', async ()=>{

        const mockContainer ={
            prepare : vi.fn().mockReturnValue({
                get:vi.fn().mockReturnValue({uuid:"",path:"",size:""})}),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };
        container.register(TOKENS.DatabaseProvider, {useValue: mockDatabaseProvider});
        container.register(TOKENS.SearchQueryBuilder,{
            useValue:{
                withFilter: vi.fn(),
            }
        });

        const doc = container.resolve(SQLiteDocumentRepository);

        const result = await doc.findMainFileByDocumentUuid("");

        expect(result).toBeInstanceOf(File);
    });

    it('findAttachmentsByDocumentUuid(string)', async ()=>{

        const mockContainer ={
            prepare : vi.fn().mockReturnValue({
                all:vi.fn().mockReturnValue([new File('','',''), new File('','','')])}),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };
        container.register(TOKENS.DatabaseProvider, {useValue: mockDatabaseProvider});
        container.register(TOKENS.SearchQueryBuilder,{
            useValue:{
                withFilter: vi.fn(),
            }
        });

        const doc = container.resolve(SQLiteDocumentRepository);

        const result = await doc.findAttachmentsByDocumentUuid("");

        expect(Array.isArray(result)).toBe(true);
        for(const r of result) 
            expect(r).toBeInstanceOf(File);
    });

    it('findMetadataByDocumentUuid(string)', async ()=>{

        const mockContainer ={
            prepare : vi.fn().mockReturnValue({
                all:vi.fn().mockReturnValue(
                    [
                        new Metadata('','',MetadataTypeEnum.DATE),
                        new Metadata('','',MetadataTypeEnum.DATE)
                    ])
            }),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };
        container.register(TOKENS.DatabaseProvider, {useValue: mockDatabaseProvider});
        container.register(TOKENS.SearchQueryBuilder,{
            useValue:{
                withFilter: vi.fn(),
            }
        });

        const doc = container.resolve(SQLiteDocumentRepository);

        const result = await doc.findMetadataByDocumentUuid("");

        expect(Array.isArray(result)).toBe(true);
        for(const r of result) 
            expect(r).toBeInstanceOf(Metadata);
    });

    it('findByUuid(string)', async ()=>{

        const mockContainer ={
            prepare : vi.fn().mockReturnValue({
                get:vi.fn().mockReturnValue(new Document('','',new File('','',''),[],[],'')),
                all:vi.fn().mockReturnValue([new File('','',''), new File('','','')])
            }),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };
        container.register(TOKENS.DatabaseProvider, {useValue: mockDatabaseProvider});
        container.register(TOKENS.SearchQueryBuilder,{
            useValue:{
                withFilter: vi.fn(),
            }
        });

        const doc = container.resolve(SQLiteDocumentRepository);

        const result = await doc.findByUuid("");

        expect(result).toBeInstanceOf(Document);
    });

    it('findAllByDipUuid(string)', async ()=>{

        const mockContainer ={
            prepare : vi.fn().mockReturnValue({
                all:vi.fn()
                    .mockReturnValueOnce(
                        [
                            new Document('','',new File('','',''),[],[],'')
                        ]
                    )
                    .mockReturnValueOnce(
                        [
                            new File('','',''),
                            new File('','','')
                        ]
                    )
                    .mockReturnValueOnce(
                        [
                            new Metadata('','',MetadataTypeEnum.DATE),
                            new Metadata('','',MetadataTypeEnum.DATE)
                        ]
                    ),
                get:vi.fn().mockReturnValue({uuid:"",path:"",size:""})
            }),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };
        container.register(TOKENS.DatabaseProvider, {useValue: mockDatabaseProvider});
        container.register(TOKENS.SearchQueryBuilder,{
            useValue:{
                withFilter: vi.fn(),
            }
        });

        const doc = container.resolve(SQLiteDocumentRepository);

        const result = await doc.findAllByDipUuid("");

        expect(Array.isArray(result)).toBe(true);
        for(const r of result) 
            expect(r).toBeInstanceOf(Document);
    });

    it('findFileByUuid(string)', async ()=>{

        const mockContainer ={
            prepare : vi.fn().mockReturnValue({
                get:vi.fn()
                    .mockReturnValueOnce({uuid:'',path:'',size:''})
            }),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };
        container.register(TOKENS.DatabaseProvider, {useValue: mockDatabaseProvider});
        container.register(TOKENS.SearchQueryBuilder,{
            useValue:{
                withFilter: vi.fn(),
            }
        });

        const doc = container.resolve(SQLiteDocumentRepository);

        const resultComplete = await doc.findFileByUuid("");
        const resultNull = await doc.findFileByUuid("");

        expect(resultComplete).toBeInstanceOf(File);
        expect(resultNull).toBeNull();
    });

    it('findAllByMetadata(string)', async ()=>{

        const mockContainer ={
            prepare : vi.fn().mockReturnValue({
                all:vi.fn()
                    .mockReturnValueOnce([''])
                    .mockReturnValueOnce(
                        [
                            new Document('','',new File('','',''),[],[],'')
                        ]
                    )
                    .mockReturnValueOnce(
                        [
                            new Metadata('','',MetadataTypeEnum.DATE),
                            new Metadata('','',MetadataTypeEnum.DATE)
                        ]
                    )
                    ,
                get:vi.fn().mockReturnValue(new Document('','',new File('','',''),[],[],'')),
            }),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };
        container.register(TOKENS.DatabaseProvider, {useValue: mockDatabaseProvider});
        container.register(TOKENS.SearchQueryBuilder,{
            useValue:{
                withFilter: vi.fn(),
                buildQuery: vi.fn().mockReturnValue({query:'',params:[]}),
            }
        });

        const doc = container.resolve(SQLiteDocumentRepository);

        const result = await doc.findAllByMetadata([new MetadataFilter('Formato','.pdf')]);
        const resultEmpty = await doc.findAllByMetadata([]);

        expect(Array.isArray(resultEmpty)).toBe(true);
        expect(resultEmpty.length).toBe(0);

        expect(Array.isArray(result)).toBe(true);
        for(const r of result) 
            expect(r).toBeInstanceOf(Document);
    });
})
