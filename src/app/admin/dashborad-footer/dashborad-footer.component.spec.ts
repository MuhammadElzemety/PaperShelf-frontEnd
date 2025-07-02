import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradFooterComponent } from './dashborad-footer.component';

describe('DashboradFooterComponent', () => {
  let component: DashboradFooterComponent;
  let fixture: ComponentFixture<DashboradFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboradFooterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboradFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
