import React, { useContext, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import { LoginContext } from "../../components/LoginInfo/LoginInfo";
import ScheduleModal from "../../components/ScheduleModal/ScheduleModal";
import "./Schedule.scss";
import { Redirect } from "react-router-dom";

import { serverURL } from "../../config";

const Schedule = () => {
  const [initEvents, setInitEvents] = useState(null);
  const [dateSelected, setDateSelected] = useState(false);
  const [info, setInfo] = useState(null);
  const [clicked, setClicked] = useState(null);
  const [task, setTask] = useState(null);
  const [modifyEmployees, setModifyEmployees] = useState(null);
  const [modifyEmployeesID, setModifyEmployeesID] = useState(null);

  const fetchSchedule = () => {
    axios.get(`${serverURL}/schedule`).then((response) => {
      return setInitEvents(response.data);
    });
  };
  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleChange = (info) => {
    const { event } = info;
    axios
      .put(`${serverURL}/schedule/${event.id}`, {
        id: event.id,
        task: event.extendedProps.task,
        start: new Date(event.startStr).getTime(),
        end: new Date(event.endStr).getTime(),
        allDay: event.allDay,
        employees: event.extendedProps.employees,
        employeesID: event.extendedProps.employeesID,
      })
      .catch((err) => console.log(err));
  };

  const handleDateSelect = (selectInfo) => {
    setDateSelected(true);
    setInfo(selectInfo);
  };
  const closeModal = () => {
    if (dateSelected) setDateSelected(null);
    if (clicked) setClicked(null);
  };
  const handleEventClick = (clickInfo) => {
    setInfo(clickInfo);
    setTask(clickInfo.event.extendedProps.task);
    setModifyEmployees(clickInfo.event.extendedProps.employees);
    setModifyEmployeesID(clickInfo.event.extendedProps.employeesID);
    return setClicked(true);
  };
  const randomColor = () => {
    let rc = "#";
    for (let i = 0; i < 6; i++) {
      rc += Math.floor(Math.random() * 16).toString(16);
    }
    return rc;
  };
  const renderEventContent = (eventInfo) => {
    const employees = eventInfo.event.extendedProps.employees;
    const task = eventInfo.event.extendedProps.task;
    eventInfo.backgroundColor = randomColor();
    return (
      <div className="h-full w-full bg-white/50 overflow-auto">
        <p className="font-bold text-green-600 px-2 text-xl italic">{task}</p>
        {employees &&
          employees.map((employee) => {
            return (
              <p className="pl-2 font-semibold text-black" key={employee}>
                - {employee}
              </p>
            );
          })}
        <p className="text-black mt-2">
          Shift: <span className="font-bold">{eventInfo.timeText}</span>
        </p>
      </div>
    );
  };
  const { state: ContextState } = useContext(LoginContext);
  const { loggedIn, employee } = ContextState;
  if (!loggedIn) return <Redirect to="/" />;
  const permit = Number(employee) < 300000;

  return (
    <>
      {dateSelected && <ScheduleModal info={info} closeModal={closeModal} />}
      {clicked && (
        <ScheduleModal
          info={info}
          closeModal={closeModal}
          task={task}
          employees={modifyEmployees}
          employeesID={modifyEmployeesID}
        />
      )}
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
              editable={permit ? true : false}
              selectable={permit ? true : false}
              selectMirror={permit ? true : false}
              dayMaxEvents={true}
              weekends={true}
              initialEvents={initEvents}
              select={(selectInfo) => handleDateSelect(selectInfo)}
              eventContent={renderEventContent}
              eventClick={permit ? handleEventClick : false}
              eventsSet={fetchSchedule}
              eventChange={fetchSchedule}
              eventResizableFromStart={permit ? true : false}
              eventResize={permit ? handleChange : false}
              eventDrop={permit ? handleChange : false}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Schedule;
