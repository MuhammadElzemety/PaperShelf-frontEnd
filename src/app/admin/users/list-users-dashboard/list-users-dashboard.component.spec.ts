import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListUsersDashboardComponent } from './list-users-dashboard.component';

describe('ListUsersDashboardComponent', () => {
  let component: ListUsersDashboardComponent;
  let fixture: ComponentFixture<ListUsersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUsersDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListUsersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
