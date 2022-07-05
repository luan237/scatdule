import React from "react";
import Employee from "../Employee/Employee";

const EmployeeList = (props) => {
  return (
    <div className={props.className}>
      {props.list.map((employee) => {
        return (
          <Employee
            info={employee}
            key={employee.id}
            // selected={props.selected}
            click={(id) => props.click(id)}
          />
        );
      })}
    </div>
  );
};

export default EmployeeList;
