import { Component, Input } from '@angular/core';
import { VacationEvent } from '../events/vacation-event';
import { VacationEventService } from '../events/vacation-event.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar-details',
  templateUrl: './calendar-details.component.html',
  styleUrls: ['./calendar-details.component.css']
})
export class CalendarDetailsComponent {

  @Input()
  event: VacationEvent;

  @Input()
  refresh: Subject<any>;

  @Input()
  createHandler: Function;
  @Input()
  updateHandler: Function;
  @Input()
  deleteHandler: Function;

  constructor (private eventService: VacationEventService) {}

  createEvent(event: VacationEvent) {
    this.eventService.createEvent(event).then((newEvent: VacationEvent) => {
      this.createHandler(newEvent);
    });
  }

  updateEvent(event: VacationEvent): void {
    this.eventService.updateEvent(event).then((updatedEvent: VacationEvent) => {
      this.updateHandler(updatedEvent);
    });
  }

  deleteEvent(eventId: String): void {
    this.eventService.deleteEvent(eventId).then((deletedEventId: String) => {
      this.deleteHandler(deletedEventId);
    });
  }

}
