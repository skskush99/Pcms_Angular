import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceRangeComponent } from './police-range.component';

describe('PoliceRangeComponent', () => {
  let component: PoliceRangeComponent;
  let fixture: ComponentFixture<PoliceRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliceRangeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
