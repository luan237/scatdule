import "./global.scss";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Schedule from "./pages/Schedule";
import PageHeader from "./components/PageHeader";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";

function App(state) {
  return (
    <BrowserRouter>
      <PageHeader route={state} />
      <Switch>
        <Redirect exact from="/" to="/login" component={LandingPage} />
        <Route path="/login" component={LandingPage} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/dashboard" component={Dashboard} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
