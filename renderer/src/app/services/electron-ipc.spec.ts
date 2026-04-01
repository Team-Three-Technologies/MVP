import { TestBed } from '@angular/core/testing';

import { ElectronIpc } from './electron-ipc';

describe('ElectronIpc', () => {
  let service: ElectronIpc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectronIpc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
