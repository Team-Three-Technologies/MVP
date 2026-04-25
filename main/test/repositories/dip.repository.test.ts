import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';
import { SQLiteDipRepository } from '../../src/repositories/dip.repository.sqlite';
import { Dip } from '../../src/domain/dip.model';

describe('Test SQLiteDipRepository', () =>{
    beforeEach(()=>{
        container.clearInstances();
        container.register(TOKENS.DatabaseProvider, { useValue: {} });
    });
    it('save(dip), se avviene con successo restituisce il dip passato', async ()=>{

        const mockStatement ={
            run : vi.fn().mockReturnValue({changes: 1,lastInsertRowid:1}),
        };
        const mockContainer ={
            prepare : vi.fn().mockReturnValue(mockStatement),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };
        container.register(TOKENS.DatabaseProvider, {
            useValue: mockDatabaseProvider,
        });

        const dipRepo = container.resolve(SQLiteDipRepository);

        const result = await dipRepo.save(new Dip('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',new Date(),10,10));
        expect(result).toBeInstanceOf(Dip);
    });

    it('findByUuid(string), ritorna un dip con quel uuid',async ()=>{
        const mockStatement ={
            get : vi.fn().mockReturnValue({
                                            processUuid:'',
                                            creationDate:new Date(),
                                            documentsCount: 10,
                                            aipCount:2}),
        };
        const mockContainer ={
            prepare : vi.fn().mockReturnValue(mockStatement),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };

        container.register(TOKENS.DatabaseProvider, {
            useValue: mockDatabaseProvider,
        });

        const dipRepo = container.resolve(SQLiteDipRepository);
        const result = await dipRepo.findByUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
        
        expect(result).toBeInstanceOf(Dip);
    });
    it('findByUuid(string), ritorna null',async ()=>{
        const mockStatement ={
            get : vi.fn(),
        };
        const mockContainer ={
            prepare : vi.fn().mockReturnValue(mockStatement),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };

        container.register(TOKENS.DatabaseProvider, {
            useValue: mockDatabaseProvider,
        });

        const dipRepo = container.resolve(SQLiteDipRepository);
        const result = await dipRepo.findByUuid('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
        
        expect(result).toBeNull();
    });

});
