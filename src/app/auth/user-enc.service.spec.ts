import { TestBed } from '@angular/core/testing';

import { UserEncService } from './user-enc.service';

describe('UserEncService', () => {
  let service: UserEncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserEncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
