import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUsersDashboardComponent } from './edit-users-dashboard.component';

describe('EditUsersDashboardComponent', () => {
  let component: EditUsersDashboardComponent;
  let fixture: ComponentFixture<EditUsersDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUsersDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditUsersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
