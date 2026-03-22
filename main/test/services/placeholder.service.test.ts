// just to push
import { container } from 'tsyringe';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PlaceholderService', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Restituisce true', () => {
    expect(true).toBeTruthy();
  })
});