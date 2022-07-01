import axios from "axios";
import React, { useState, useContext } from "react";
import "./LandingPage.scss";
import { Redirect } from "react-router-dom";
import { LoginContext } from "../../components/LoginInfo/LoginInfo";
/////////////////////////////////////////////
// const User = React.createContext();
////////////////////////////////////////////

const serverURL = "http://localhost:5050";
const LandingPage = (props) => {
  const { loggedIn, loginError, login } = useContext(LoginContext);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  // const [loggedIn, setLoggedIn] = useState(!!localStorage.token);
  loggedIn = !!localStorage.token;

  const handleSubmit = (e) => {
    e.preventDefault();
    login(user, password);
    axios
      .post(`${serverURL}/login`, {
        employeeID: user,
        password: password,
      })
      .then((response) => {
        localStorage.setItem("token", response.data);
      })
      .then(() => {
        setLoggedIn(true);
      })
      .catch(() => {
        setLoggedIn(false);
        setError(true);
        return;
      });
  };

  if (loggedIn) return <Redirect to="/dashboard" />;

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
        {loginError && (
          <p className="main__error">Wrong ID or password, please try again</p>
        )}
      </div>
    </main>
  );
};

export default LandingPage;
