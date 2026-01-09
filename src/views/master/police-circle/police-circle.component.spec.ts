import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliceCircleComponent } from './police-circle.component';

describe('PoliceCircleComponent', () => {
  let component: PoliceCircleComponent;
  let fixture: ComponentFixture<PoliceCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoliceCircleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PoliceCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
