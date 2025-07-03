import { TestBed } from '@angular/core/testing';

import { HomebookService } from './homebook.service';

describe('HomebookService', () => {
  let service: HomebookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomebookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
