import axios from "axios";
import React, { useState } from "react";
import "./LandingPage.scss";

const serverURL = "http://localhost:5050";
const LandingPage = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${serverURL}/login`, {
        employee: user,
        password: password,
      })
      .then((response) => console.log(response));
  };

  return (
    <main className="main">
      <div className="main__background"></div>
      <div className="main__login">
        <h1 className="main__login--title">LOGIN</h1>
        <form className="main__login--form form" onSubmit={handleSubmit}>
          <label className="form__label" htmlFor="employeeID">
            Employee ID
          </label>
          <input
            type="number"
            id="employeeID"
            className="form__input"
            name="employeeID"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <label className="form__label">Password</label>
          <input
            type="password"
            id="employeePassword"
            className="form__input"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">SIGN IN</button>
        </form>
      </div>
    </main>
  );
};

export default LandingPage;
