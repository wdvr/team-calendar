import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  addHours
} from 'date-fns';
import {
  CalendarEvent,
} from 'angular-calendar';
import { VacationEvent } from './vacation-event';
import { Eventtype } from './eventtype.enum';
import { User } from '../users/user';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Injectable({
  providedIn: 'root'
})

export class VacationEventService {
  private eventsUrl = '/api/events';

  constructor(private http: Http) { }
  events: VacationEvent[];

  // get("/api/events")
  getEvents(): Promise<void | VacationEvent[]> {
    // return Promise.resolve(this.events);

    return this.http.get(this.eventsUrl)
      .toPromise()
      .then(response => response.json() as VacationEvent[])
      .then(events => events.map(this.deserializeDates))
      .catch(this.handleError);
  }

  // post("/api/events")
  createEvent(newEvent: VacationEvent): Promise<void | VacationEvent> {
    return this.http.post(this.eventsUrl, newEvent)
      .toPromise()
      .then(response => response.json() as VacationEvent)
      .catch(this.handleError);
  }

  // get("/api/events/:id") endpoint not used by Angular app

  // delete("/api/events/:id")
  deleteEvent(delEvendId: String): Promise<void | String> {
    return this.http.delete(this.eventsUrl + '/' + delEvendId)
      .toPromise()
      .then(response => response.json() as String)
      .catch(this.handleError);
  }

  // put("/api/events/:id")
  updateEvent(putEvent: VacationEvent): Promise<void | VacationEvent> {
    const putUrl = this.eventsUrl + '/' + putEvent._id;
    return this.http.put(putUrl, putEvent)
      .toPromise()
      .then(response => response.json() as VacationEvent)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
  }

  private deserializeDates(event: VacationEvent<any>) {
    event.start = new Date(event.start);
    event.end = new Date(event.end);
    return event;
  }
}


