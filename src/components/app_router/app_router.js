import React from 'react';
import { BrowserRouter,Switch,Route } from 'react-router-dom';
import { hot } from 'react-hot-loader';

import Navbar from '../navbar/navbar';
import DashboardsIndex from '../dashboards_index/dashboards_index';

import styles from './app_router.sass';

class AppRouter extends React.Component {
  render(){
    return (
      <BrowserRouter>
        <div className="router">
          <Navbar />
          <div className="container">
            <Switch>
              <Route exact path="/" component={DashboardsIndex} />
            </Switch>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default hot(module)(AppRouter);