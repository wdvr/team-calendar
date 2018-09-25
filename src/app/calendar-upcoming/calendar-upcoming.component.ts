import { Component, OnInit } from '@angular/core';
import { VacationEvent } from '../events/vacation-event';
import { VacationEventService } from '../events/vacation-event.service';

@Component({
  selector: 'app-calendar-upcoming',
  templateUrl: './calendar-upcoming.component.html',
  styleUrls: ['./calendar-upcoming.component.css']
})
export class CalendarUpcomingComponent implements OnInit {
  events: VacationEvent[] = [];

  constructor(private eventService: VacationEventService) { }

  ngOnInit() {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getEvents()
    .then((events: VacationEvent[]) => {
      this.events = events.slice(0, 4);
  });
  }

}
