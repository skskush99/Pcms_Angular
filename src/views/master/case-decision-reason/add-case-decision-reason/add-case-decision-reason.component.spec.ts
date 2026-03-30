import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCaseDecisionReasonComponent } from './add-case-decision-reason.component';

describe('AddCaseDecisionReasonComponent', () => {
  let component: AddCaseDecisionReasonComponent;
  let fixture: ComponentFixture<AddCaseDecisionReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCaseDecisionReasonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCaseDecisionReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
