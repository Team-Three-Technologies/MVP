import { container } from 'tsyringe';
import { beforeEach, describe, expect, it } from 'vitest';

describe('OpenDialogService', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Restituisce true', () => {
    expect(true).toBeTruthy();
  })
});