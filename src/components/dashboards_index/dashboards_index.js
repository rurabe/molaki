import React from 'react';

import MortgagesList from '../mortgages_list/mortgages_list';

import styles from './dashboards_index.sass';

class DashboardsIndex extends React.PureComponent {
  render(){
    return (
      <div>
        <h1>Mortgages</h1>
        <div className="row">
          <div className="col-sm">
            <MortgagesList />
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardsIndex;