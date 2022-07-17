import "./global.scss";
import { useContext } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Schedule from "./pages/Schedule";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import PageHeader from "./components/PageHeader";
import AddNew from "./pages/AddNew";
import EditPage from "./pages/EditPage";
import { LoginContext } from "./components/LoginInfo/LoginInfo";

function App() {
  const { state: ContextState, logout, selected } = useContext(LoginContext);
  const { employee, loggedIn } = ContextState;
  return (
    <BrowserRouter>
      <PageHeader employee={employee} loggedIn={loggedIn} logout={logout} />
      <Switch>
        <Redirect exact from="/" to="/login" component={LandingPage} />
        <Route path="/login" component={LandingPage} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/addnew" component={AddNew} />
        {/* {console.log(selected)} */}
        <Route
          path="/edit/:id"
          render={(props) => <EditPage {...props} selected={selected} />}
        />
      </Switch>
    </BrowserRouter>
  );
}
export default App;
