import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradSidebarComponent } from './dashborad-sidebar.component';

describe('DashboradSidebarComponent', () => {
  let component: DashboradSidebarComponent;
  let fixture: ComponentFixture<DashboradSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboradSidebarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboradSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
