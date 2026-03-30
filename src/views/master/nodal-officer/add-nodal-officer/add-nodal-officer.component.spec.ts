import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNodalOfficerComponent } from './add-nodal-officer.component';

describe('AddNodalOfficerComponent', () => {
  let component: AddNodalOfficerComponent;
  let fixture: ComponentFixture<AddNodalOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNodalOfficerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddNodalOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
