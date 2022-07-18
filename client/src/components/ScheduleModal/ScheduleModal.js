import { useState, useEffect, useContext } from "react";
import { v4 as uuid } from "uuid";
import { LoginContext } from "../LoginInfo/LoginInfo";
import axios from "axios";
import { serverURL } from "../../config";

const ScheduleModal = (props) => {
  const { data, fetchData } = useContext(LoginContext);
  const [selected, setSelected] = useState(props.employees ?? []);
  const [selectedID, setSelectedID] = useState(props.employeesID ?? []);
  const [task, setTask] = useState(props.task ?? "");
  useEffect(() => {
    fetchData();
    // do not delete
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        start: new Date(selectInfo.startStr).getTime(),
        end: new Date(selectInfo.endStr).getTime(),
        allDay: selectInfo.allDay,
        employees: selected,
        employeesID: selectedID,
      };
      calendarApi.addEvent(newEvent);
      axios.post(`${serverURL}/schedule`, newEvent);
      setSelected([]);
      setSelectedID([]);
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
          employeesID: event.extendedProps.employeesID,
        })
        .catch((err) => console.log(err));
      setSelected([]);
      setSelectedID([]);
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
        <h1 className="text-3xl text-red-600 ml-8 mt-4">Add a new Schedule</h1>
        <form className="flex justify-around mt-4" onSubmit={handleSubmit}>
          <div className="h-full">
            <label className="text-3xl leading-loose">Choose Employee</label>
            <div className="ml-4 mb-4 h-96 overflow-scroll">
              {data &&
                data.map((employee) => {
                  return (
                    <div key={employee.id} className="mb-2 ml-4">
                      <input
                        type="checkbox"
                        id={employee.id}
                        name={employee.name}
                        onChange={(e) => {
                          if (e.target.checked) {
                            selected.push(e.target.name);
                            selectedID.push(e.target.id);
                          } else if (!e.target.checked) {
                            selected.splice(selected.indexOf(e.target.name), 1);
                            selectedID.splice(
                              selectedID.indexOf(e.target.id),
                              1
                            );
                          }
                        }}
                        defaultChecked={
                          selected.find((em) => em === employee.name)
                            ? true
                            : false
                        }
                        className="mr-2"
                      />
                      <label htmlFor={employee.id}>{employee.name}</label>
                    </div>
                  );
                })}
            </div>
          </div>
          <div>
            <label>Task: </label>
            <textarea
              type="text"
              name="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="border-2 rounded-xl block resize-none w-60 mb-8 h-40 pl-2"
            ></textarea>
            <div className="flex gap-6">
              <button
                className="bg-blue-600 p-2 w-16 rounded-3xl"
                type="submit"
              >
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
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
