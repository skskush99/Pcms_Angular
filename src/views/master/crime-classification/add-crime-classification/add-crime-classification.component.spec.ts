import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCrimeClassificationComponent } from './add-crime-classification.component';

describe('AddCrimeClassificationComponent', () => {
  let component: AddCrimeClassificationComponent;
  let fixture: ComponentFixture<AddCrimeClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCrimeClassificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCrimeClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
