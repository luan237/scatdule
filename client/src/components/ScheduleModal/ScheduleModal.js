import { useState, useEffect, useContext } from "react";
import "./ScheduleModal.scss";
import { v4 as uuid } from "uuid";
import { LoginContext } from "../LoginInfo/LoginInfo";
import axios from "axios";

const serverURL = "http://localhost:5050";
const ScheduleModal = (props) => {
  const { data, fetchData } = useContext(LoginContext);
  const [selected, setSelected] = useState(props.employees ?? []);
  const [task, setTask] = useState(props.task ?? "");
  useEffect(() => {
    fetchData();
  }, []);
  const handleSubmit = (e, selectInfo) => {
    e.preventDefault();
    selectInfo = props.info;
    if (selectInfo.startStr) {
      let calendarApi = selectInfo.view.calendar;
      calendarApi.unselect();
      let newID = uuid();
      const newEvent = {
        id: newID,
        task: e.target.task.value,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        employees: selected,
      };
      calendarApi.addEvent(newEvent);
      axios.post(`${serverURL}/schedule`, newEvent);
      setSelected([]);
    } else {
      const { event } = selectInfo;
      event.setExtendedProp("task", e.target.task.value);
      axios
        .put(`${serverURL}/schedule/${event.id}`, {
          id: event.id,
          task: task,
          start: new Date(event.startStr).getTime(),
          end: new Date(event.endStr).getTime(),
          allDay: event.allDay,
          employees: event.extendedProps.employees,
        })
        .catch((err) => console.log(err));
    }
    props.closeModal();
  };
  const handleCancel = () => {
    props.closeModal();
  };

  const handleDelete = (id) => {
    id = props.info.event.id;
    axios.delete(`${serverURL}/schedule/${id}`).then(() => {
      props.info.event.remove();
      return props.closeModal();
    });
  };
  return (
    <div className="fixed h-full w-full top-0 z-20 bg-black/50">
      <div className="absolute h-4/6 w-4/6 bg-white left-72 top-1/2 -tranlate-x-1/2 -translate-y-1/2">
        <h1 className="text-3xl text-red-600 ml-8 mt-8">Add a new Schedule</h1>
        <form onSubmit={handleSubmit}>
          <label>Choose Employee</label>
          {data &&
            data.map((employee) => {
              return (
                <div key={employee.id}>
                  <input
                    type="checkbox"
                    id={employee.id}
                    name={employee.name}
                    onChange={(e) => {
                      if (e.target.checked) {
                        selected.push(e.target.name);
                      } else if (!e.target.checked) {
                        selected.splice(selected.indexOf(e.target.name), 1);
                      }
                    }}
                    defaultChecked={
                      selected.find((em) => em === employee.name) ? true : false
                    }
                  />
                  <label htmlFor={employee.id}>{employee.name}</label>
                </div>
              );
            })}
          <label>Task: </label>
          <input
            type="text"
            name="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="border-2 rounded-xl block"
          ></input>
          <button className="bg-blue-600 p-2 w-16 rounded-3xl" type="submit">
            Save
          </button>
          <div
            className="bg-red-300 p-2 w-16 rounded-3xl cursor-pointer"
            onClick={handleCancel}
          >
            Cancel
          </div>
          <div
            className="bg-red-700 p-2 w-16 rounded-3xl cursor-no-drop"
            onClick={handleDelete}
          >
            Delete
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
