import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDecisionTypeComponent } from './case-decision-type.component';

describe('CaseDecisionTypeComponent', () => {
  let component: CaseDecisionTypeComponent;
  let fixture: ComponentFixture<CaseDecisionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseDecisionTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseDecisionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
