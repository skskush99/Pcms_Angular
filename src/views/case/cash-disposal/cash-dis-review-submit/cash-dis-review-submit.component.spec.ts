import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDisReviewSubmitComponent } from './cash-dis-review-submit.component';

describe('CashDisReviewSubmitComponent', () => {
  let component: CashDisReviewSubmitComponent;
  let fixture: ComponentFixture<CashDisReviewSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashDisReviewSubmitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashDisReviewSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
