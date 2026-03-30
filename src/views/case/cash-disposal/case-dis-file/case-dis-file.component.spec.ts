import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDisFileComponent } from './case-dis-file.component';

describe('CaseDisFileComponent', () => {
  let component: CaseDisFileComponent;
  let fixture: ComponentFixture<CaseDisFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseDisFileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CaseDisFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
