import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrimeSubActComponent } from './add-crime-sub-act.component';

describe('AddCrimeSubActComponent', () => {
  let component: AddCrimeSubActComponent;
  let fixture: ComponentFixture<AddCrimeSubActComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCrimeSubActComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCrimeSubActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
