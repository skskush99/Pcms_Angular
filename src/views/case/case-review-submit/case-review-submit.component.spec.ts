import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseReviewSubmitComponent } from './case-review-submit.component';

describe('CaseReviewSubmitComponent', () => {
  let component: CaseReviewSubmitComponent;
  let fixture: ComponentFixture<CaseReviewSubmitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseReviewSubmitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseReviewSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
