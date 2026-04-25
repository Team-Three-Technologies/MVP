import { container } from 'tsyringe';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOKENS } from '../../src/infrastructure/di/tokens';

import { SQLiteConservationProcessRepository } from '../../src/repositories/conservation-process.repository.sqlite';
import { ConservationProcess } from '../../src/domain/conservation-process.model';

describe('Test SQLiteConservationProcess', ()=>{
    beforeEach(()=>{
        container.clearInstances();
        container.register(TOKENS.DatabaseProvider, { useValue: {} });
    });

    it('save(conservationProcess), se avviene con successo restituisce il conservationProcess passato', async ()=>{

        const mockContainer ={
            prepare : vi.fn().mockReturnValue({
                run:vi.fn()}),
        };
        const mockDatabaseProvider={
            instance: mockContainer,
        };
        container.register(TOKENS.DatabaseProvider, {
            useValue: mockDatabaseProvider,
        });

        const procConsRepo = container.resolve(SQLiteConservationProcessRepository);

        const result = await procConsRepo
            .save(new ConservationProcess(
                'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                new Date(),
                '10 byte',
                10,
                10,
                10,
                'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                'v1.0'));
        expect(result).toBeInstanceOf(ConservationProcess);
    });

})
