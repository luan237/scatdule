import "./global.scss";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { LoginContext } from "./components/LoginInfo/LoginInfo";
import Schedule from "./pages/Schedule";
// import PageHeader from "./components/PageHeader";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { useContext } from "react";

function App() {
  const { loggedIn } = useContext(LoginContext);
  if (!loggedIn) {
    return (
      <BrowserRouter>
        <Switch>
          <Redirect exact from="/" to="/login" component={LandingPage} />
          <Route path="/login" component={LandingPage} />
        </Switch>
      </BrowserRouter>
    );
  } else {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/schedule" component={Schedule} />
          <Route path="/dashboard" component={Dashboard} />
        </Switch>
      </BrowserRouter>
    );
  }
}
export default App;
