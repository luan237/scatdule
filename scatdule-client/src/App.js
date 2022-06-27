import "./global.scss";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Schedule from "./pages/Schedule";
import PageHeader from "./components/PageHeader";
import LandingPage from "./pages/LandingPage";

function App() {
  return (
    <BrowserRouter>
      <PageHeader />
      <Switch>
        <Redirect exact from="/" to="/login" component={LandingPage} />
        <Route path="/login" component={LandingPage} />
        <Route path="/schedule" component={Schedule} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
