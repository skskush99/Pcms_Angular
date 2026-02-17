import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PravivranNo3KhaComponent } from './pravivran-no3-kha.component';

describe('PravivranNo3KhaComponent', () => {
  let component: PravivranNo3KhaComponent;
  let fixture: ComponentFixture<PravivranNo3KhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PravivranNo3KhaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PravivranNo3KhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
