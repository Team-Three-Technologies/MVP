import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipDetails } from './dip-details';

describe('DipDetails', () => {
  let component: DipDetails;
  let fixture: ComponentFixture<DipDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DipDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(DipDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
