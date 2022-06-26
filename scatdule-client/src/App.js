import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Schedule from "./pages/Schedule";
import PageHeader from "./components/PageHeader";
function App() {
  return (
    <BrowserRouter>
      <PageHeader />
      <Switch>
        <Route path="/schedule" component={Schedule} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
