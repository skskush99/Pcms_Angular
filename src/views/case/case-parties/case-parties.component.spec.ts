import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasePartiesComponent } from './case-parties.component';

describe('CasePartiesComponent', () => {
  let component: CasePartiesComponent;
  let fixture: ComponentFixture<CasePartiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CasePartiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CasePartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
