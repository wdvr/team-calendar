import { Eventtype } from './eventtype.enum';

import {
    CalendarEvent, CalendarEventTimesChangedEventType,
  } from 'angular-calendar';

export interface VacationEvent<MetaType = any> extends CalendarEvent {
    _id?: string;
    user: string;
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
