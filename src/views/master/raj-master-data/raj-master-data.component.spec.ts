import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RajMasterDataComponent } from './raj-master-data.component';

describe('RajMasterDataComponent', () => {
  let component: RajMasterDataComponent;
  let fixture: ComponentFixture<RajMasterDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RajMasterDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RajMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
