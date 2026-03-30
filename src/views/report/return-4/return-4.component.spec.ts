import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Return4Component } from './return-4.component';

describe('Return4Component', () => {
  let component: Return4Component;
  let fixture: ComponentFixture<Return4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Return4Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Return4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
