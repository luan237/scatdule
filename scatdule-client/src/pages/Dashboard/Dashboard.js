import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../components/LoginInfo/LoginInfo";
import EmployeeList from "../../components/EmployeeList";
import InfoBox from "../../components/InfoBox/InfoBox";
import "./Dashboard.scss";
import { Redirect } from "react-router-dom";
// import LoginInfo from "../../components/LoginInfo/LoginInfo";

//////////////////////////////////

const Panel = () => {
  const {
    state: ContextState,
    fetchData,
    data,
    selected,
  } = useContext(LoginContext);

  const { loggedIn } = ContextState;
  const [select, setSelected] = useState(selected);
  const handleClick = (id) => {
    setSelected(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setSelected(selected);
  }, [selected]);
  if (!loggedIn) return <Redirect to="/" />;
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
      <section className="dashboard flex justify-between">
        {!data && (
          <div className="loading">
            <p className="animate-pulse mt-72">Loading...</p>
          </div>
        )}
        {data && select && (
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
                    selected={select}
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
                  selected={select}
                  click={(id) => handleClick(id)}
                />
              </div>
            </div>
            <div className="dashboard__info w-1/2">
              {select && <InfoBox selected={select} />}
            </div>
          </>
        )}
      </section>
    </>
  );
};
export default Panel;
