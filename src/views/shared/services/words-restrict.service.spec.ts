import { TestBed } from '@angular/core/testing';

import { WordsRestrictService } from './words-restrict.service';

describe('WordsRestrictService', () => {
  let service: WordsRestrictService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordsRestrictService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
