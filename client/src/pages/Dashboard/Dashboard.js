import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from "../../components/LoginInfo/LoginInfo";
import EmployeeList from "../../components/EmployeeList";
import InfoBox from "../../components/InfoBox/InfoBox";
import "./Dashboard.scss";
import { Redirect, Link } from "react-router-dom";

const Dashboard = () => {
  const {
    state: ContextState,
    fetchData,
    data,
    selected,
  } = useContext(LoginContext);

  const { loggedIn, employee } = ContextState;
  const [select, setSelected] = useState(selected);
  const handleClick = (id) => {
    setSelected(id);
  };

  useEffect(() => {
    fetchData();
    // do not delete
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const permit = Number(employee) < 300000;

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
                  click={(id) => handleClick(id)}
                />
              </div>
            </div>
            <div className="dashboard__info w-1/2">
              {select && <InfoBox selected={select} />}
              <div className="flex flex-row justify-between w-96">
                {permit && (
                  <Link
                    to="/addnew"
                    className="dashboard__info--add w-40 border-none bg-green-300/50 h-10 flex items-center justify-center cursor-pointer"
                  >
                    <p className="text-green-600 font-bold">Add new employee</p>
                  </Link>
                )}

                <div className="dashboard__info--add w-40 border-none bg-pink-300/50 h-10 flex items-center justify-center cursor-pointer">
                  <p className="text-pink-600 font-bold">Edit information</p>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};
export default Dashboard;
