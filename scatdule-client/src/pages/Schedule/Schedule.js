import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
// const uuid = require("uuid");
import { v4 as uuid } from "uuid";
import PageHeader from "../../components/PageHeader";

const serverURL = "http://localhost:5050";

class Schedule extends React.Component {
  state = {
    weekendsVisible: true,
    events: [],
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

  handleResize = (info) => {
    const { event } = info;
    axios
      .put(`${serverURL}/schedule/${info.event.id}`, {
        id: event.id,
        title: event.title,
        start: new Date(event.startStr).getTime(),
        end: new Date(event.endStr).getTime(),
        allDay: event.allDay,
      })
      .catch((err) => console.log(err));
  };
  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible,
    });
  };

  handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter employee name and tasks");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      let newID = uuid();
      calendarApi.addEvent({
        id: newID,
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
      axios.post(`${serverURL}/schedule`, {
        id: newID,
        title,
        start: Date.parse(selectInfo.startStr),
        end: Date.parse(selectInfo.endStr),
        allDay: selectInfo.allDay,
      });
    }
  };

  handleEventClick = (clickInfo) => {
    const selectedId = clickInfo.event.id;
    if (
      window.confirm(
        `Are you sure you want to delete this schedule time? '${clickInfo.event.title}'`
      )
    ) {
      axios.delete(`${serverURL}/schedule/${selectedId}`);
      clickInfo.event.remove();
    }
  };

  renderEventContent(eventInfo) {
    return (
      <>
        <b style={{ color: "red" }}>{eventInfo.timeText}</b>
        <br></br>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }
  render() {
    return (
      <>
        <PageHeader />
        <div className="schedule">
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
                select={this.handleDateSelect}
                eventContent={this.renderEventContent} // custom render function
                eventClick={this.handleEventClick}
                eventsSet={() => this.fetchData()} // called after events are initialized/added/changed/removed
                eventResizableFromStart={true}
                eventResize={this.handleResize}
              />
            </div>
          )}
        </div>
      </>
    );
  }
}

export default Schedule;
