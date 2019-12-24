import { TestBed } from '@angular/core/testing';

import { ChatSharedService } from './chat-shared.service';

describe('ChatSharedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatSharedService = TestBed.get(ChatSharedService);
    expect(service).toBeTruthy();
  });
});
