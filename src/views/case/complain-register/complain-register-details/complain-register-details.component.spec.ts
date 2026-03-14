import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainRegisterDetailsComponent } from './complain-register-details.component';

describe('ComplainRegisterDetailsComponent', () => {
  let component: ComplainRegisterDetailsComponent;
  let fixture: ComponentFixture<ComplainRegisterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplainRegisterDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComplainRegisterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
