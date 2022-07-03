import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ContextProvider } from "./components/LoginInfo/LoginInfo";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ContextProvider value={"abc"}>
      <App />
    </ContextProvider>
  </React.StrictMode>
);
