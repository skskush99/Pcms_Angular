import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PravivranNo3KComponent } from './pravivran-no3-k.component';

describe('PravivranNo3KComponent', () => {
  let component: PravivranNo3KComponent;
  let fixture: ComponentFixture<PravivranNo3KComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PravivranNo3KComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PravivranNo3KComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
