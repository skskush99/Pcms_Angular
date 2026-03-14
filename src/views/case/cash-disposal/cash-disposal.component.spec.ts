import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDisposalComponent } from './cash-disposal.component';

describe('CashDisposalComponent', () => {
  let component: CashDisposalComponent;
  let fixture: ComponentFixture<CashDisposalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashDisposalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashDisposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
