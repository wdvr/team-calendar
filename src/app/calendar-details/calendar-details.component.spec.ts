import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDetailsComponent } from './calendar-details.component';

describe('CalendarDetailsComponent', () => {
  let component: CalendarDetailsComponent;
  let fixture: ComponentFixture<CalendarDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
