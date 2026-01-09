import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPageAdminComponent } from './list-page-admin.component';

describe('ListPageAdminComponent', () => {
  let component: ListPageAdminComponent;
  let fixture: ComponentFixture<ListPageAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPageAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
