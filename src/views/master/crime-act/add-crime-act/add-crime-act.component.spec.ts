import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrimeActComponent } from './add-crime-act.component';

describe('AddCrimeActComponent', () => {
  let component: AddCrimeActComponent;
  let fixture: ComponentFixture<AddCrimeActComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCrimeActComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCrimeActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
