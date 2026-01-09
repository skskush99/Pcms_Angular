import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourtTypeComponent } from './add-court-type.component';

describe('AddCourtTypeComponent', () => {
  let component: AddCourtTypeComponent;
  let fixture: ComponentFixture<AddCourtTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCourtTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCourtTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
