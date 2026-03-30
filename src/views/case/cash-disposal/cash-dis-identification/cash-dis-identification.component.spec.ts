import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDisIdentificationComponent } from './cash-dis-identification.component';

describe('CashDisIdentificationComponent', () => {
  let component: CashDisIdentificationComponent;
  let fixture: ComponentFixture<CashDisIdentificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashDisIdentificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashDisIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
