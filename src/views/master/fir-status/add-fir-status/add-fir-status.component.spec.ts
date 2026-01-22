import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFirStatusComponent } from './add-fir-status.component';

describe('AddFirStatusComponent', () => {
  let component: AddFirStatusComponent;
  let fixture: ComponentFixture<AddFirStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFirStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFirStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
