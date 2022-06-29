import axios from "axios";
import React, { useState, useEffect } from "react";
import EmployeeList from "../../components/EmployeeList";
import "./Dashboard.scss";

const serverURL = "http://localhost:5050";

const Panel = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`${serverURL}/login`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data);
        console.log(response.data);
      });
  }, []);
  let managers, employees;
  if (Array.isArray(data)) {
    managers = data.filter((people) => people.position === "manager");
    if (managers.length === 0) {
      managers = null;
    }
    employees = data.filter((people) => people.position === "employee");
  } else {
    employees = [data];
  }
  return (
    <section className="dashboard">
      {!data && (
        <div className="loading">
          <p className="animate-pulse">Loading...</p>
        </div>
      )}
      {data && (
        <div className="dashboard__main">
          {managers && <EmployeeList list={managers} />}
          <EmployeeList list={employees} />
          {/* {managers && (
            <div className="dashboard__manager manager">
              {managers.map((manager) => {
                return (
                  <div
                    key={manager.id}
                    className="manager__list"
                    style={{ color: "red" }}
                  >
                    <h1>{manager.name}</h1>
                  </div>
                );
              })}
            </div>
          )}
          <div className="dashboard__employee employee">
            {employees.map((employee) => {
              return (
                <p
                  key={employee.id}
                  className="employee__list"
                  style={{ color: "blue" }}
                >
                  {employee.name}
                </p>
              );
            })}
          </div> */}
        </div>
      )}
    </section>
  );
};

export default Panel;
