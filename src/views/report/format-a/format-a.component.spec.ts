import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatAComponent } from './format-a.component';

describe('FormatAComponent', () => {
  let component: FormatAComponent;
  let fixture: ComponentFixture<FormatAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatAComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormatAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
