import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridActionButtonComponent } from './grid-action-button.component';

describe('GridActionButtonComponent', () => {
  let component: GridActionButtonComponent;
  let fixture: ComponentFixture<GridActionButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridActionButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GridActionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
