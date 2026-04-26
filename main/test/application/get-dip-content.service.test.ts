import { container } from 'tsyringe';
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { GetDipContentService } from '../../src/application/get-dip-content.service';
import { Dip } from '../../src/domain/dip.model';
import { Document } from '../../src/domain/document.model';
import { File } from '../../src/domain/file.model';
import { Metadata } from '../../src/domain/metadata.model';
import { MetadataTypeEnum } from '../../src/domain/metadata-type.enum'; 

describe('Test get-dip-content',()=>{
    beforeEach(()=>{
        container.clearInstances();
        container.register(TOKENS.DipRepository, { useValue: {} });
        container.register(TOKENS.DocumentRepository, { useValue: {} });
    });

    it('Dip non presente',async()=>{
        container.register(TOKENS.DipRepository, {
            useValue:{
                findByUuid: vi.fn()
            }
        });
        container.register(TOKENS.DocumentRepository,{
            useValue:{
            }
        });
        const getDipContent = container.resolve(GetDipContentService); 
        expect(getDipContent.execute("")).rejects.toThrow(`Non esiste un DiP con questo UUID: `);
    });

    it('Test con tutto ok',async()=>{
        container.register(TOKENS.DipRepository, {
            useValue:{
                findByUuid: vi.fn().mockReturnValue(new Dip('',new Date(),0,0)),
            }
        });
        container.register(TOKENS.DocumentRepository,{
            useValue:{
                findAllByDipUuid: vi.fn().mockReturnValue(
                    [
                        new Document(
                            'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                            'path',
                            new File('','',''),
                            [new File('','','')],
                            [new Metadata('','',MetadataTypeEnum.DATE)],
                            ''),

                        new Document(
                            'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                            'path',
                            new File('','',''),
                            [new File('','','')],
                            [new Metadata('','',MetadataTypeEnum.DATE)],
                            ''),
                    ]
                )
            }
        });
        const getDipContent = container.resolve(GetDipContentService); 
        const result = await getDipContent.execute("");
        expect(result).toEqual({
            uuid: expect.any(String),
            creationDate: expect.any(Date),
            documentNumber: expect.any(Number),
            aipNumber: expect.any(Number),
            documentsList: expect.any(Array),
        });

        result.documentsList.forEach(doc => {
            expect(doc).toEqual({
                documentUuid: expect.any(String),
                documentName: expect.any(String),
                documentAttachments: expect.any(Array),
            });

            doc.documentAttachments.forEach(att => {
                expect(att).toEqual({
                    uuid: expect.any(String),
                    name: expect.any(String),
                });
            });
        });    
    });
});
