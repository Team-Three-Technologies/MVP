import { container } from 'tsyringe';
import { beforeEach, describe, expect, it } from 'vitest';

describe('AipInfoParserV1', () => {
  beforeEach(() => {
    container.clearInstances();
  });

  it('Restituisce true', () => {
    expect(true).toBeTruthy();
  });
});
