import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrimeSubActComponent } from './crime-sub-act.component';

describe('CrimeSubActComponent', () => {
  let component: CrimeSubActComponent;
  let fixture: ComponentFixture<CrimeSubActComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrimeSubActComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrimeSubActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
