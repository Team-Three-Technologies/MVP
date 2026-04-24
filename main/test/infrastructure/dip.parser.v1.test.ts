import { container } from 'tsyringe';
import { beforeEach, describe, expect, it } from 'vitest';

describe('DipParserV1', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Restituisce true', () => {
    expect(true).toBeTruthy();
  });
});
