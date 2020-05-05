import React from 'react';
import ReactDOM from 'react-dom';
import SearchPage from './Components/SearchPage';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import StatsPage from './Components/StatVisualization/StatsPage';
import PlantsPage from './Components/ElectricPlants/PlantsPage';
import LoginPage from './Components/Login';
import RegistrationPage from './Components/Registration';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route path="/" component={SearchPage} exact />
        <Route path="/stats" component={StatsPage} exact />
        <Route path="/plants" component={PlantsPage} exact />
        <Route path="/register" component={RegistrationPage} exact />
        <Route path="/login" component={LoginPage} exact />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
