import axios from "axios";
import { createContext, useState } from "react";
import { Redirect } from "react-router-dom";

/////////////////////////////////
const serverURL = "http://localhost:5050";
export const LoginContext = createContext();

const initialState = {
  loggedIn: !!localStorage.token,
  loginPending: false,
  loginError: null,
  // data: null,
  // selected: null,
};
export const ContextProvider = (props) => {
  const [state, setState] = useState(initialState);
  const setLoggedIn = (loggedIn) => setState({ loggedIn });
  const setLoginPending = (loginPending) => setState({ loginPending });
  const setLoginError = (loginError) => setState({ loginError });
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);

  const login = (user, password) => {
    setLoggedIn(!!localStorage.token);
    setLoginPending(true);
    setLoginError(null);

    fetchLogin(user, password, (error) => {
      if (!error) {
        setLoggedIn(!!localStorage.token);
      } else {
        setLoginError(error);
      }
    });
  };

  const logout = () => {
    setLoginPending(false);
    localStorage.removeItem("token");
    setLoggedIn(false);
    setLoginError(null);
  };
  const fetchData = () => {
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
  };
  return (
    <LoginContext.Provider
      value={{
        state,
        login,
        logout,
        fetchData,
        data,
        selected,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};

const fetchLogin = (user, password, error) => {
  axios
    .post(`${serverURL}/login`, {
      employeeID: user,
      password: password,
    })
    .then((response) => {
      localStorage.setItem("token", response.data);
    })
    .then(() => {
      return error(null);
    })
    .catch(() => {
      return error(new Error("Invalid employeeID and password"));
    });
};
