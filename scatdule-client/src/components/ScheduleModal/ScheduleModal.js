import { useState, useEffect } from "react";
import "./ScheduleModal.scss";
import axios from "axios";
const serverURL = "http://localhost:5050";
const ScheduleModal = () => {
  const [list, setList] = useState();

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${serverURL}/login`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        return setList(response.data);
      });
  }, []);
  return (
    <div className="fixed h-full w-full top-0 z-20 bg-black/50">
      <div className="absolute h-4/6 w-4/6 bg-white left-72 top-1/2 -tranlate-x-1/2 -translate-y-1/2">
        <h1>Add a new Schedule</h1>
        <form>
          <label>Employee name:</label>
          <select>
            <option></option>
          </select>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
