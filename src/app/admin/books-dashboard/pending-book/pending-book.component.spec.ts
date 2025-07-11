import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBookComponent } from './pending-book.component';

describe('PendingBookComponent', () => {
  let component: PendingBookComponent;
  let fixture: ComponentFixture<PendingBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingBookComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
