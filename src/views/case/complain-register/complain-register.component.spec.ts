import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainRegisterComponent } from './complain-register.component';

describe('ComplainRegisterComponent', () => {
  let component: ComplainRegisterComponent;
  let fixture: ComponentFixture<ComplainRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplainRegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComplainRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
