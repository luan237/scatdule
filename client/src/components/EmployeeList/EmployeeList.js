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
            click={(id) => props.click(id)}
            permit={props.permit}
            handleDelete={props.handleDelete}
          />
        );
      })}
    </div>
  );
};

export default EmployeeList;
