import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirChargesSheetComponent } from './fir-charges-sheet.component';

describe('FirChargesSheetComponent', () => {
  let component: FirChargesSheetComponent;
  let fixture: ComponentFixture<FirChargesSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirChargesSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirChargesSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
