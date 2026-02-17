import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MahilaAtayacharBnsComponent } from './mahila-atayachar-bns.component';

describe('MahilaAtayacharBnsComponent', () => {
  let component: MahilaAtayacharBnsComponent;
  let fixture: ComponentFixture<MahilaAtayacharBnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MahilaAtayacharBnsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MahilaAtayacharBnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
