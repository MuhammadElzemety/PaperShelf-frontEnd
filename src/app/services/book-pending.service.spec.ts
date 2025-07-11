import { TestBed } from '@angular/core/testing';

import { BookPendingService } from './book-pending.service';

describe('BookPendingService', () => {
  let service: BookPendingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookPendingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
