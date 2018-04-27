import React from 'react';
import { connect } from 'react-redux';
import { createMergeAction } from 'standard-reducer';

import MortgagesSelector from '../../selectors/mortgages_selector';

import Mortgage from '../../models/mortgage';

import MortgagesCard from '../mortgages_card/mortgages_card';

import styles from './mortgages_list.sass'

class MortgagesList extends React.PureComponent {
  render(){
    const mortgages = this.props.mortgages.map(m => {
      return <MortgagesCard key={m.id} mortgage={m} />
    })
    return (
      <div>
        <button className="btn btn-primary btn-lg btn-block" onClick={this.newMortgage}>
          New Mortgage
        </button>
        <ul className="mortgages-list">
          {mortgages}
        </ul>
      </div>
    );
  }

  newMortgage = (e) => {
    this.props.mergeUnsavedMortgages({
      [Date.now()]: new Mortgage({id: Date.now()})
    })
  }
}

const mstp = (state) => {
  return { mortgages: MortgagesSelector(state) }
}

const mdtp = {
  mergeUnsavedMortgages: createMergeAction('unsaved_mortgages')
};

export default connect(mstp,mdtp)(MortgagesList);