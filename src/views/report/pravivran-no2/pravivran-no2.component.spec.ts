import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PravivranNo2Component } from './pravivran-no2.component';

describe('PravivranNo2Component', () => {
  let component: PravivranNo2Component;
  let fixture: ComponentFixture<PravivranNo2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PravivranNo2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PravivranNo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
