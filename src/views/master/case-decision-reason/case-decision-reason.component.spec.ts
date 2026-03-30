import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDecisionReasonComponent } from './case-decision-reason.component';

describe('CaseDecisionReasonComponent', () => {
  let component: CaseDecisionReasonComponent;
  let fixture: ComponentFixture<CaseDecisionReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseDecisionReasonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseDecisionReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
