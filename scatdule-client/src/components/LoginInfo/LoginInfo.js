import { createContext, useState } from "react";
/////////////////////////////////

export const LoginContext = createContext(null);

// const initialState = {
//   isLoggedIn: false,
//   isLoginError: null
// }
export const ContextProvider = (props) => {
  const [loggedIn, setLogggedIn] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const login = (user, password, error) => {
    if (!error) {
      setLogggedIn(true);
      setLoginError(null);
    } else {
      setLoginError(true);
    }
  };

  const logout = () => {
    setLogggedIn(false);
    setLoginError(null);
  };
  console.log(loggedIn);

  return (
    <LoginContext.Provider
      value={{
        loggedIn,
        loginError,
        login,
        logout,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};
