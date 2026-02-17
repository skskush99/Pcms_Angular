import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PravivranNo3Component } from './pravivran-no3.component';

describe('PravivranNo3Component', () => {
  let component: PravivranNo3Component;
  let fixture: ComponentFixture<PravivranNo3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PravivranNo3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PravivranNo3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
