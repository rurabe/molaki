'use strict';
import React from 'react';
import { createMergeAction } from 'standard-reducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import MortgagesCardForm from '../mortgages_card_form/mortgages_card_form';

import styles from './mortgages_card.sass'

class MortgagesCard extends React.PureComponent {
  render(){
    let rating;
    if(this.props.mortgage.score){
      rating = (
        <div className="rating">
          <span className="grade">{this.props.mortgage.grade}</span>
          <span className="score">({Math.floor(100 *this.props.mortgage.score).toFixed()})</span>
        </div>
      );
    }

    return (
      <li className="card border-primary mortgages-card">
        <div className="card-header">
          <div className="row">
            <div className="col-4">
              <input className="form-control" placeholder="Lender" value={this.props.mortgage.lender || ''} onChange={this.updateLender}/>
            </div>
            <div className="col-6"></div>
            <div className="col-2">
              {rating}
            </div>
          </div>
        </div>
        <div className="card-body">
          <MortgagesCardForm mortgage={this.props.mortgage} />
        </div>
      </li>
    );
  }

  updateLender = (e) => {
    this.props.mergeMortgages({[this.props.mortgage.id]: {lender: e.target.value} });
  }
}

const mdtp = (dispatch,props) => {
  return bindActionCreators({
    mergeMortgages: createMergeAction(props.mortgage.reducer())
  },dispatch);
};

export default connect(null,mdtp)(MortgagesCard);