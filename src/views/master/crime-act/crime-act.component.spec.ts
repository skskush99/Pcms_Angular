import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrimeActComponent } from './crime-act.component';

describe('CrimeActComponent', () => {
  let component: CrimeActComponent;
  let fixture: ComponentFixture<CrimeActComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrimeActComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrimeActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
