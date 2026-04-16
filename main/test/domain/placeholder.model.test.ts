// just to push
import { container } from 'tsyringe';
import { beforeEach, describe, expect, it } from 'vitest';

describe('PlaceholderModel', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Restituisce true', () => {
    expect(true).toBeTruthy();
  });
});
