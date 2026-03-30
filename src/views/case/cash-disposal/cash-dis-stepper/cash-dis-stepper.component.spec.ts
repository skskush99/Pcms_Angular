import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDisStepperComponent } from './cash-dis-stepper.component';

describe('CashDisStepperComponent', () => {
  let component: CashDisStepperComponent;
  let fixture: ComponentFixture<CashDisStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashDisStepperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashDisStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
