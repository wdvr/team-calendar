import { Component, OnInit } from '@angular/core';
import { VacationEvent } from '../events/vacation-event';
import { VacationEventService } from '../events/vacation-event.service';
import {
  startOfDay
} from 'date-fns';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { Eventtype } from '../events/eventtype.enum';

@Component({
  selector: 'app-calendar-upcoming',
  templateUrl: './calendar-upcoming.component.html',
  styleUrls: ['./calendar-upcoming.component.css']
})
export class CalendarUpcomingComponent implements OnInit {
  events: VacationEvent[] = [];
  users: User[] = [];
  eventTypes = Eventtype;

  constructor(private eventService: VacationEventService, private userService: UserService) { }

  ngOnInit() {
    this.getEvents();
  }

  getEvents(): void {
    this.userService
      .getUsers()
      .then((users: User[]) => {
        this.users = users;

        this.eventService.getEvents()
          .then((events: VacationEvent[]) => {
            this.events = events.filter(e => e.start > startOfDay(new Date()))
              .sort((d1, d2) => d2.start.getDate() - d1.start.getDate())
              .slice(0, 4);
          });
      });
  }

  getFullName(username: String) {
    const user = this.users.filter(u => u.username === username)[0];
    return user ? user.name : 'Unknown user';
  }
}
