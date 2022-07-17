import axios from "axios";
import { createContext, useState } from "react";

const serverURL = "http://localhost:5050";
export const LoginContext = createContext();

const initialState = {
  loggedIn: !!sessionStorage.token,
  loginPending: false,
  loginError: null,
  employee: null,
};
export const ContextProvider = (props) => {
  const [state, setState] = useState(initialState);
  const setLoggedIn = (loggedIn) => setState({ loggedIn });
  const setLoginPending = (loginPending) => setState({ loginPending });
  const setLoginError = (loginError) => setState({ loginError });
  const setEmployee = (employee) => setState({ employee });
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);

  const login = (user, password) => {
    setLoggedIn(!!sessionStorage.token);
    setLoginPending(true);
    setLoginError(null);
    setEmployee(null);

    fetchLogin(user, password, (error) => {
      if (!error) {
        setState({
          loggedIn: !!sessionStorage.token,
          employee: user,
        });
      } else {
        setLoginError(error);
      }
    });
  };

  const logout = () => {
    setLoginPending(false);
    sessionStorage.removeItem("token");
    setLoggedIn(false);
    setLoginError(null);
  };
  const fetchData = () => {
    const token = sessionStorage.getItem("token");
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

  const handleEmployee = (employee) => {
    setSelected(employee);
  };
  return (
    <LoginContext.Provider
      value={{
        state,
        login,
        logout,
        fetchData,
        handleEmployee,
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
      sessionStorage.setItem("token", response.data);
    })
    .then(() => {
      return error(null);
    })
    .catch(() => {
      return error(new Error("Invalid employeeID and password"));
    });
};
