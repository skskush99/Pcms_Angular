import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseRegStepperComponent } from './case-reg-stepper.component';

describe('CaseRegStepperComponent', () => {
  let component: CaseRegStepperComponent;
  let fixture: ComponentFixture<CaseRegStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseRegStepperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseRegStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
