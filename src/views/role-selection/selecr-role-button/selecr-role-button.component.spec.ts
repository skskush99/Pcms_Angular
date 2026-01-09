import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecrRoleButtonComponent } from './selecr-role-button.component';

describe('SelecrRoleButtonComponent', () => {
  let component: SelecrRoleButtonComponent;
  let fixture: ComponentFixture<SelecrRoleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelecrRoleButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelecrRoleButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
