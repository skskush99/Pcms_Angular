import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashDisPartiesComponent } from './cash-dis-parties.component';

describe('CashDisPartiesComponent', () => {
  let component: CashDisPartiesComponent;
  let fixture: ComponentFixture<CashDisPartiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashDisPartiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashDisPartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
