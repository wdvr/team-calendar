import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarUpcomingComponent } from './calendar-upcoming.component';

describe('CalendarUpcomingComponent', () => {
  let component: CalendarUpcomingComponent;
  let fixture: ComponentFixture<CalendarUpcomingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarUpcomingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarUpcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
