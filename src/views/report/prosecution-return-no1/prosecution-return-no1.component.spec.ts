import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProsecutionReturnNo1Component } from './prosecution-return-no1.component';

describe('ProsecutionReturnNo1Component', () => {
  let component: ProsecutionReturnNo1Component;
  let fixture: ComponentFixture<ProsecutionReturnNo1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProsecutionReturnNo1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProsecutionReturnNo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
