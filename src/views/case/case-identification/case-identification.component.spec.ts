import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseIdentificationComponent } from './case-identification.component';

describe('CaseIdentificationComponent', () => {
  let component: CaseIdentificationComponent;
  let fixture: ComponentFixture<CaseIdentificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseIdentificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseIdentificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
