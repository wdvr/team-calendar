import { Eventtype } from './eventtype.enum';

export class Event {
    _id?: string;
    user: string;
    type: Eventtype;
    start_date: Date;
    end_date: Date;
}
