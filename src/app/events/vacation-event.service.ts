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

  events: VacationEvent[] = [
    {
      id: '1',
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      user: 'Peter',
      type: Eventtype.sickday,
      color: colors.red,
      actions: null,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    },
    {
      id: '2',
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
      user: 'Paul',
      type: Eventtype.vacation,
    },
    {
      id: '3',
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      user: 'Ruben',
      type: Eventtype.workfromhome,
      actions: null,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    }
  ];


  // get("/api/events")
  getEvents(): Promise<void | VacationEvent[]> {
    return Promise.resolve(this.events);
    // return this.http.get(this.eventsUrl)
    //   .toPromise()
    //   .then(response => response.json() as VacationEvent[])
    //   .catch(this.handleError);
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
  deletEvent(delEvendId: String): Promise<void | String> {
    return this.http.delete(this.eventsUrl + '/' + delEvendId)
      .toPromise()
      .then(response => response.json() as String)
      .catch(this.handleError);
  }

  // put("/api/events/:id")
  updateEvent(putEvent: VacationEvent): Promise<void | VacationEvent> {
    const putUrl = this.eventsUrl + '/' + putEvent.id;
    return this.http.put(putUrl, putEvent)
      .toPromise()
      .then(response => response.json() as VacationEvent)
      .catch(this.handleError);
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
}
