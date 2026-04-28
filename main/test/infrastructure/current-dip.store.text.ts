import { describe, expect, it } from 'vitest';
import * as CurrentDipStore from '../../src/infrastructure/current-dip.store'
describe('current-dip.store tests',()=>{
    it('setCurrentDipUuid()',()=>{
        CurrentDipStore.setCurrentDipUuid('');
        expect(CurrentDipStore.getCurrentDipUuid()).toBe('');
    });
});
