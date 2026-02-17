import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECourtCnrSearchComponent } from './e-court-cnr-search.component';

describe('ECourtCnrSearchComponent', () => {
  let component: ECourtCnrSearchComponent;
  let fixture: ComponentFixture<ECourtCnrSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ECourtCnrSearchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ECourtCnrSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
