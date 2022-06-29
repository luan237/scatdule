import React from "react";
import Employee from "../Employee/Employee";

const EmployeeList = (props) => {
  console.log(props.list);
  return (
    <div className="EmployeeList">
      {props.list.map((employee) => {
        return <Employee info={employee} />;
      })}
    </div>
  );
};

export default EmployeeList;
