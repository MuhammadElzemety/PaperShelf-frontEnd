import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundDashboardComponent } from './not-found-dashboard.component';

describe('NotFoundDashboardComponent', () => {
  let component: NotFoundDashboardComponent;
  let fixture: ComponentFixture<NotFoundDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotFoundDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
