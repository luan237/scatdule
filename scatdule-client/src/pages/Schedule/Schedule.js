import React from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

const serverURL = "http://localhost:5050";

export default class Schedule extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    initEvents: null,
  };
  fetchData = () => {
    axios.get(`${serverURL}/schedule`).then((response) => {
      let receivedData = [...response.data];
      receivedData.forEach((data) => {
        data.start = Number(data.start);
        data.end = Number(data.end);
      });
      this.setState({
        initEvents: receivedData,
      });
    });
  };
  componentDidMount() {
    this.fetchData();
  }

  render() {
    return (
      <div className="schedule">
        {() => this.renderSidebar()}
        {this.state.initEvents && (
          <div className="schedule__main">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              initialView="timeGridWeek"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={this.state.weekendsVisible}
              initialEvents={this.state.initEvents} // alternatively, use the `events` setting to fetch from a feed
              select={(selectInfo) => this.handleDateSelect(selectInfo)}
              eventContent={(eventInfo) => renderEventContent(eventInfo)} // custom render function
              eventClick={(clickInfo) => this.handleEventClick(clickInfo)}
              eventsSet={() => this.fetchData()} // called after events are initialized/added/changed/removed
            />
          </div>
        )}
      </div>
    );
  }

  renderSidebar() {
    return (
      <div className="schedule__sidebar">
        <div className="schedule__sidebar--section">
          <h2>Instructions</h2>
          <ul>
            <li>Select dates and you will be prompted to create a new event</li>
            <li>Drag, drop, and resize events</li>
            <li>Click an event to delete it</li>
          </ul>
        </div>
        <div className="schedule__sidebar--section">
          <label>
            <input
              type="checkbox"
              checked={this.state.weekendsVisible}
              onChange={this.handleWeekendsToggle}
            ></input>
            Toggle weekends
          </label>
        </div>
        <div className="schedule__sidebar--section">
          <h2>All Events ({this.state.currentEvents.length})</h2>
          <ul>{this.state.currentEvents.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    );
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
      axios.post(`${serverURL}/schedule`, {
        title,
        start: Date.parse(selectInfo.startStr),
        end: Date.parse(selectInfo.endStr),
        allDay: selectInfo.allDay,
      });
    }
  };

  handleEventClick = (clickInfo) => {
    console.log(clickInfo);
    const selectedId = clickInfo.event.id;
    if (
      window.confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      axios.delete(`${serverURL}/schedule/${selectedId}`);
      clickInfo.event.remove();
    }
  };
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}
