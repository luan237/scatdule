import React, { useState, useContext } from "react";
import "./LandingPage.scss";
import { LoginContext } from "../../components/LoginInfo/LoginInfo";
import { Redirect } from "react-router-dom";

const initialState = {
  user: "",
  password: "",
};

const LandingPage = () => {
  const { state: ContextState, login } = useContext(LoginContext);
  const { loggedIn, loginPending, loginError } = ContextState;

  const [state, setState] = useState(initialState);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { user, password } = state;
    login(user, password);
    setState({
      user: "",
      password: "",
    });
  };
  if (loggedIn) return <Redirect to="/dashboard" />;
  return (
    <main className="main">
      <div className="main__background"></div>
      <div className="main__login h-96 w-96 transition-opacity opacity-70 hover:opacity-100">
        <h1 className="main__login--title text-6xl text-blue-600 text-center mb-8">
          LOGIN
        </h1>
        <form
          className="main__login--form form flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <label className="form__label text-lg mb-3">Employee ID</label>
          <input
            type="text"
            id="user"
            className="form__input h-9 w-72 mb-8 rounded-3xl pl-4"
            name="user"
            value={state.user}
            onChange={(e) => {
              e.persist();
              setState((prevState) => {
                return { ...prevState, user: e.target.value };
              });
            }}
          />
          <label className="form__label text-lg mb-3">Password</label>
          <input
            type="password"
            id="employeePassword"
            className="form__input h-9 w-72 rounded-3xl mb-8 pl-4"
            name="password"
            value={state.password}
            onChange={(e) => {
              e.persist();
              setState((prevState) => {
                return { ...prevState, password: e.target.value };
              });
            }}
          />
          <button
            className="h-9 w-44 rounded-3xl border-none bg-indigo-700 text-white"
            type="submit"
          >
            SIGN IN
          </button>

          {loginPending && <p className="text-blue-700">Please wait...</p>}
          {loggedIn && <p className="text-blue-700">Success, redirecting...</p>}
          {loginError && (
            <p className="text-red-600 h-8 bg-pink-300 mt-6 rounded-xl px-4">
              {loginError.message}
            </p>
          )}
        </form>
      </div>
    </main>
  );
};

export default LandingPage;
