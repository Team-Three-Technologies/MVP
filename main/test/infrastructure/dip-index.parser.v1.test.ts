import { container } from 'tsyringe';
import { beforeEach, describe, expect, it } from 'vitest';

describe('DipIndexParserV1', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Restituisce true', () => {
    expect(true).toBeTruthy();
  });
});
