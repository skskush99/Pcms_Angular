import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatBComponent } from './format-b.component';

describe('FormatBComponent', () => {
  let component: FormatBComponent;
  let fixture: ComponentFixture<FormatBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormatBComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormatBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
