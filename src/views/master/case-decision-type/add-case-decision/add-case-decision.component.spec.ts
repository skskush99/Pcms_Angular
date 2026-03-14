import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCaseDecisionComponent } from './add-case-decision.component';

describe('AddCaseDecisionComponent', () => {
  let component: AddCaseDecisionComponent;
  let fixture: ComponentFixture<AddCaseDecisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCaseDecisionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCaseDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
