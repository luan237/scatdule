import axios from "axios";
import React, { useState, useEffect } from "react";
import EmployeeList from "../../components/EmployeeList";
import InfoBox from "../../components/InfoBox/InfoBox";
import "./Dashboard.scss";
import PageHeader from "../../components/PageHeader/PageHeader";
// import LoginInfo from "../../components/LoginInfo/LoginInfo";

//////////////////////////////////

const serverURL = "http://localhost:5050";

const Panel = () => {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const handleClick = (id) => {
    setSelected(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
        setSelected(response.data[0]);
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
    <>
      <PageHeader />
      <section className="dashboard flex justify-between">
        {!data && (
          <div className="loading">
            <p className="animate-pulse mt-72">Loading...</p>
          </div>
        )}
        {data && (
          <>
            <div className="dashboard__main flex gap-11">
              {managers && (
                <div className="dashboard__main--manager ml-14 mt-12 border-1 bg-red-300/50 h-fit px-4 rounded-2xl">
                  <h1 className="text-5xl text-red-600 font-bold mb-12 mt-6">
                    Manager List
                  </h1>
                  <EmployeeList
                    list={managers}
                    className="p-4"
                    selected={selected}
                    click={(id) => handleClick(id)}
                  />
                </div>
              )}
              <div className="dashboard__main--employee ml-14 mt-12 border-1 bg-blue-300/50 h-fit px-4 rounded-2xl">
                <h1 className="text-5xl text-blue-600 font-bold mb-12 mt-6">
                  Employee List
                </h1>
                <EmployeeList
                  list={employees}
                  className="p-4"
                  selected={selected}
                  click={(id) => handleClick(id)}
                />
              </div>
            </div>
            <div className="dashboard__info w-1/2">
              <InfoBox selected={selected} />
            </div>
          </>
        )}
      </section>
    </>
  );
};
export default Panel;
