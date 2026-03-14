import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDisChargesSheetComponent } from './cash-dis-charges-sheet.component';

describe('CashDisChargesSheetComponent', () => {
  let component: CashDisChargesSheetComponent;
  let fixture: ComponentFixture<CashDisChargesSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashDisChargesSheetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashDisChargesSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
