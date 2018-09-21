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
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
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

import { CalendarDetailsComponent } from '../calendar-details/calendar-details.component';
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

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  events: VacationEvent[];
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
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: VacationEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  refresh: Subject<any> = new Subject();

  activeDayIsOpen = true;

  constructor(private modal: NgbModal, private eventService: VacationEventService) {}

  ngOnInit() {
    this.eventService
     .getEvents()
     .then((events: VacationEvent[]) => {
       this.events = events;
       this.refresh.next();
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
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: VacationEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  selectEvent(event: VacationEvent) {
    this.selectedEvent = event;
  }

  private getIndexOfEvent = (eventId: String | Number) => {
    return this.events.findIndex((event) => {
      return event.id === eventId;
    });
  }


  createEvent(): VacationEvent[] {
    const event = {
      // TODO CHANGE THIS
      title: '',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: {primary: colors.red, secondary: colors.blue},
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      // TODO CHANGE THIS
      user: new User(),
      type: Eventtype.vacation
    };
    this.events.push(event);
    this.selectEvent(event);
    return this.events;
  }

  deleteEvent = (eventId: String) => {
    const idx = this.getIndexOfEvent(eventId);
    if (idx !== -1) {
      this.events.splice(idx, 1);
      this.selectEvent(null);
    }
    return this.events;
  }

  updateEvent = (event: VacationEvent) => {
    const idx = this.getIndexOfEvent(event.id);
    if (idx !== -1) {
      this.events[idx] = event;
      this.selectEvent(event);
    }
    return this.events;
  }

}
