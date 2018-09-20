import { TestBed, inject } from '@angular/core/testing';

import { VacationEventService } from './vacation-event.service';

describe('EventService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VacationEventService]
    });
  });

  it('should be created', inject([VacationEventService], (service: VacationEventService) => {
    expect(service).toBeTruthy();
  }));
});
