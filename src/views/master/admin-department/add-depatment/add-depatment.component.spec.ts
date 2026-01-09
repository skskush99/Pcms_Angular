import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDepatmentComponent } from './add-depatment.component';

describe('AddDepatmentComponent', () => {
  let component: AddDepatmentComponent;
  let fixture: ComponentFixture<AddDepatmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDepatmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddDepatmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
