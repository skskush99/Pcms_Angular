import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrimeClassificationComponent } from './crime-classification.component';

describe('CrimeClassificationComponent', () => {
  let component: CrimeClassificationComponent;
  let fixture: ComponentFixture<CrimeClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrimeClassificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrimeClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
