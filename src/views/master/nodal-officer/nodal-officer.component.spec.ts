import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodalOfficerComponent } from './nodal-officer.component';

describe('NodalOfficerComponent', () => {
  let component: NodalOfficerComponent;
  let fixture: ComponentFixture<NodalOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NodalOfficerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NodalOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
