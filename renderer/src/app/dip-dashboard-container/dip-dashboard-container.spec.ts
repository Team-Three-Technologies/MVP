import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DipDashboardContainer } from './dip-dashboard-container';

describe('DipDashboardContainer', () => {
  let component: DipDashboardContainer;
  let fixture: ComponentFixture<DipDashboardContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DipDashboardContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(DipDashboardContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
