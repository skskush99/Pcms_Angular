import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMenuMappingComponent } from './user-menu-mapping.component';

describe('UserMenuMappingComponent', () => {
  let component: UserMenuMappingComponent;
  let fixture: ComponentFixture<UserMenuMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenuMappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserMenuMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
