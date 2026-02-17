import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PravivranNo7Component } from './pravivran-no7.component';

describe('PravivranNo7Component', () => {
  let component: PravivranNo7Component;
  let fixture: ComponentFixture<PravivranNo7Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PravivranNo7Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PravivranNo7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
