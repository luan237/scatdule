import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
const serverURL = "http://localhost:5050";

const InfoBox = (props) => {
  const employee = props.selected;
  const upperCasePosition =
    employee.position[0].toUpperCase() + employee.position.substring(1);
  const [weekData, setWeekData] = useState([]);
  const getWeekInfo = () => {
    axios.get(`${serverURL}/schedule/${employee.id}`).then((response) => {
      let thisWeek = response.data.filter((days) => {
        return onCurrentWeek(days.start) ?? days;
      });
      thisWeek.sort((a, b) => a.start - b.start);
      return setWeekData(thisWeek);
    });
  };

  const onCurrentWeek = (currentDate) => {
    let date = new Date(currentDate);
    const weekLength = 604800000;
    let lastSunday = new Date();
    lastSunday.setDate(lastSunday.getDate() - lastSunday.getDay());
    lastSunday.setHours(0, 0, 0, 0);
    const res =
      lastSunday.getTime() <= date.getTime() &&
      date.getTime() <= lastSunday.getTime() + weekLength;
    return res;
  };
  const convertDay = (date) => {
    const shift = new Date(date);
    const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const day = daysOfTheWeek[shift.getDay()];
    return day;
  };
  const convertTime = (date) => {
    const shift = new Date(date);
    const hour = shift.getHours();
    let minutes = shift.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hour}:${minutes}`;
  };

  const getPayment = () => {
    let time = 0;
    weekData.forEach((shift) => {
      const hours = (shift.end - shift.start) / 3600000;
      time += hours;
    });
    return time;
  };
  useEffect(() => {
    getWeekInfo();
    // do not delete
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selected]);
  return (
    <div className="ml-20 mt-20 fixed w-96">
      <img src={serverURL + employee.avatar} alt="avatar" className="w-96" />
      <div className="opacity-0 flex flex-col justify-around absolute text-slate-200 top-0 pl-6 h-96 w-96 hover:bg-black/80 hover:opacity-100">
        <p className="font-bold">EmployeeID: {employee.id}</p>
        <p className="font-extrabold text-2xl">Name: {employee.name}</p>
        <p>Position: {upperCasePosition}</p>
        <p>Wage: {employee.wage}</p>
        <p>Phone#: {employee.phone}</p>
        <p>Address: {employee.address}</p>
      </div>
      <div>
        <div className="border-2 rounded-lg bg-amber-200 h-56 w-full mt-7 pl-5 pt-3 overflow-scroll">
          <h2 className="text-xl font-bold">Shift this week:</h2>
          {!weekData && <p>Loading</p>}
          <ul>
            {weekData &&
              weekData.map((shift) => {
                return (
                  <li key={shift.id}>
                    <span className="font-bold">{`${convertDay(
                      shift.start
                    )}`}</span>{" "}
                    :{" "}
                    {`${convertTime(shift.start)} - ${convertTime(shift.end)}`}
                  </li>
                );
              })}
          </ul>
        </div>
        <div className="border-2 rounded-lg bg-amber-200 h-20 w-full mt-7 pl-5 pt-3">
          <h2>
            Total payment this week:{" "}
            <span className="text-red-500 font-semibold">
              {getPayment() * employee.wage}$
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
