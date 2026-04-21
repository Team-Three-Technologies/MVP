import { DipPresenter } from './dip-presenter';
import { TestBed } from '@angular/core/testing';

describe('DipPresenter', () => {
  let presenter: DipPresenter;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DipPresenter] });
    presenter = TestBed.inject(DipPresenter);
  });
  it('should create an instance', () => expect(presenter).toBeTruthy());
});
