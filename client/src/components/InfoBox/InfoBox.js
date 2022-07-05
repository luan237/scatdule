import React from "react";
import "./InfoBox.scss";
const serverURL = "http://localhost:5050";

const InfoBox = (props) => {
  const employee = props.selected;
  const upperCasePosition =
    employee.position[0].toUpperCase() + employee.position.substring(1);
  return (
    <div className="ml-20 mt-20 relative w-96">
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
        <div className="border-2 rounded-lg bg-amber-200 h-56 w-full mt-7 pl-5 pt-3">
          <h2 className="text-xl font-bold">Shift this week:</h2>
          <ul>
            <li>a</li>
            <li>b</li>
            <li>c</li>
            <li>d</li>
          </ul>
        </div>
        <div className="border-2 rounded-lg bg-amber-200 h-20 w-full mt-7 pl-5 pt-3">
          <h2>Total payment this week: $</h2>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
