import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirStatusComponent } from './fir-status.component';

describe('FirStatusComponent', () => {
  let component: FirStatusComponent;
  let fixture: ComponentFixture<FirStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
