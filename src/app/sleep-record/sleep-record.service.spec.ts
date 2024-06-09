import { TestBed } from '@angular/core/testing';

import { SleepRecordService } from './sleep-record.service';

describe('SleepRecordService', () => {
  let service: SleepRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SleepRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
