import React, { useContext, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { v4 as uuid } from "uuid";
import { LoginContext } from "../../components/LoginInfo/LoginInfo";
import PageHeader from "../../components/PageHeader";
import ScheduleModal from "../../components/ScheduleModal/ScheduleModal";
import "./Schedule.scss";
import { Redirect } from "react-router-dom";

const serverURL = "http://localhost:5050";

const Schedule = () => {
  // state = {
  //   weekendsVisible: true,
  //   events: [],
  //   initEvents: null,
  // };
  // const [weekendsVisible, setWeekendsVisible] = useState(true);
  // const [events, setEvents] = useState([]);
  const [initEvents, setInitEvents] = useState(null);
  const fetchData = () => {
    axios.get(`${serverURL}/schedule`).then((response) => {
      let receivedData = [...response.data];
      receivedData.forEach((data) => {
        data.start = Number(data.start);
        data.end = Number(data.end);
      });
      setInitEvents(receivedData);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleResize = (info) => {
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
  // const handleWeekendsToggle = () => {
  //   setWeekendsVisible(!weekendsVisible);
  // };

  const handleDateSelect = (selectInfo) => {
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

  const handleEventClick = (clickInfo) => {
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

  const renderEventContent = (eventInfo) => {
    return (
      <>
        <b style={{ color: "red" }}>{eventInfo.timeText}</b>
        <br></br>
        <i>{eventInfo.event.title}</i>
      </>
    );
  };
  const { state: ContextState } = useContext(LoginContext);
  const { loggedIn } = ContextState;
  if (!loggedIn) return <Redirect to="/" />;

  return (
    <>
      <PageHeader />
      <ScheduleModal />
      <div className="schedule z-10 relative">
        {initEvents && (
          <>
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
              weekends={true}
              initialEvents={initEvents} // alternatively, use the `events` setting to fetch from a feed
              select={handleDateSelect}
              eventContent={renderEventContent} // custom render function
              eventClick={handleEventClick}
              eventsSet={fetchData} // called after events are initialized/added/changed/removed
              eventResizableFromStart={true}
              eventResize={handleResize}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Schedule;
