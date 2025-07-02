import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradHeaderComponent } from './dashborad-header.component';

describe('DashboradHeaderComponent', () => {
  let component: DashboradHeaderComponent;
  let fixture: ComponentFixture<DashboradHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboradHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboradHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
