import { TestBed } from '@angular/core/testing';

import { BackendFacade } from './backend.facade';

describe('BackendFacade', () => {
  let service: BackendFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackendFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
