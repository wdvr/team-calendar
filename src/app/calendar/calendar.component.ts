import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  isSameDay,
  isSameMonth
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarView
} from 'angular-calendar';
import { VacationEvent,
  VacationEventAction,
  VacationEventTimesChangedEvent
 } from '../events/vacation-event';
import { VacationEventService } from '../events/vacation-event.service';
import { Eventtype } from '../events/eventtype.enum';

import { User } from '../users/user';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  events: VacationEvent[];
  users: User[];
  eventTypes = Eventtype;
  eventTypeKeys: any[];

  editingEvent = null;

  selectedEvent: VacationEvent;

  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: VacationEvent;
  };

  actions: VacationEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: VacationEvent }): void => {
        this.selectEvent( event );
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  activeDayIsOpen = true;

  constructor(private modal: NgbModal, private eventService: VacationEventService, private userService: UserService) {
    this.eventTypeKeys = Object.keys(this.eventTypes);

  }

  ngOnInit() {
    console.log('today is ', new Date());
    this.userService
    .getUsers()
    .then((users: User[]) => {
      this.users = users;
      this.eventService
      .getEvents()
      .then((events: VacationEvent[]) => {
        events.forEach(e => {
          const eventUser = this.users.filter(user => user.username === e.user)[0];
          if (eventUser) {
            e.title = eventUser.name + ': ' + this.eventTypes[e.type];
            e.color.primary = eventUser.color;
            e.color.secondary = eventUser.color;
          }
        });
       this.events = events;
       this.refresh.next();
      });
    });
 }

  dayClicked({ date, events }: { date: Date; events: VacationEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: VacationEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.updateEvent(event);
    this.refresh.next();
  }

  selectEvent(event: VacationEvent) {
    this.selectedEvent = event;
  }

  private getIndexOfEvent = (eventId: String | Number) => {
    return this.events.findIndex((event) => {
      return event._id === eventId;
    });
  }

  startDateChanged(event) {
    event.start = startOfDay(event.start);
    if (event.end < event.start) {
      event.end = endOfDay(event.start);
    }
    console.log('start date: ' + event.start);
  }

  endDateChanged(event) {
    event.end = endOfDay(event.end);
    console.log('end date: ' + event.end);
  }

  editEvent(eventId: String) {
    this.editingEvent = eventId;
  }

  createEvent() {
    const event = {
      title: '',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: {primary: '', secondary: ''},
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      user: 'newuser',
      type: Eventtype.VACATION
    };

    this.eventService.createEvent(event).then((newEvent: VacationEvent) => {
      this.events.push(newEvent);
      this.selectEvent(newEvent);
      this.editEvent(newEvent._id);
      this.refresh.next();
      });
  }


  deleteEvent = (eventId: String) => {
    this.eventService.deleteEvent(eventId).then((deletedEventId: String) => {
      const idx = this.getIndexOfEvent(eventId);
      if (idx !== -1) {
        this.events.splice(idx, 1);
        this.selectEvent(null);
      }
      this.refresh.next();

      return this.events;
    });
  }

  updateEvent = (event: VacationEvent) => {
    this.eventService.updateEvent(event).then((updatedEvent: VacationEvent) => {
      const idx = this.getIndexOfEvent(event._id);
      if (idx !== -1) {
        this.events[idx] = event;
        this.selectEvent(event);
      }
      this.editingEvent = null;
      this.refresh.next();
      return this.events;
    });
  }
}
