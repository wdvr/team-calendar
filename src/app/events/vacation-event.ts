import { Eventtype } from './eventtype.enum';

import {
    CalendarEvent, CalendarEventTimesChangedEventType,
  } from 'angular-calendar';
import { User } from '../users/user';

export interface VacationEvent<MetaType = any> extends CalendarEvent {
    _id?: string;
    user: User;
    type: Eventtype;
}

export interface VacationEventAction {
    label: string;
    cssClass?: string;
    onClick({ event }: {
        event: VacationEvent;
    }): any;
}

export interface VacationEventTimesChangedEvent<MetaType = any> {
    type: CalendarEventTimesChangedEventType;
    event: VacationEvent<MetaType>;
    newStart: Date;
    newEnd?: Date;
    allDay?: boolean;
}
