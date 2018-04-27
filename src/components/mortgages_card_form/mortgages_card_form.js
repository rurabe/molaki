'use strict';
import React from 'react';
import { createMergeAction } from 'standard-reducer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { scores, grade } from '../../helpers/mortgages_helpers';

import styles from './mortgages_card_form.sass'

class MortgagesCardForm extends React.PureComponent {
  render(){
    const pctDownPaymentBtnClasses = classnames('btn','btn-outline-secondary',{ })
    return (
      <div className="mortgages-card-form row">
        <div className="col-3">
          <div className="form-group rate">
            <label htmlFor={`${this.props.mortgage.id}_rate`}>Interest Rate</label>
            <div className="input-group">
              <input className="form-control" id={`${this.props.mortgage.id}_rate`} placeholder="3.8" value={this.props.mortgage.rate || ''} onChange={this.updateRate} />
              <div className="input-group-append">
                <div className="input-group-text">%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-2">
          <div className="form-group points col-12">
            <label htmlFor={`${this.props.mortgage.id}_points`}>Points</label>
            <input className="form-control" id={`${this.props.mortgage.id}_points`} placeholder="1.0" value={this.props.mortgage.points || ''} onChange={this.updatePoints} />
          </div>
          <div className="form-group col-12">
            <label htmlFor={`${this.props.mortgage.id}_type`}>Type</label>
            <select className="form-control" id={`${this.props.mortgage.id}_type`} value={this.props.mortgage.term} onChange={this.updateTerm}>
              <option value={360}>30 Year Fixed</option>
              <option value={180}>15 Year Fixed</option>
            </select>
          </div>
        </div>
        <div className="col-3">
          <div className="form-group col-12">
            <label className="second" htmlFor={`${this.props.mortgage.id}_purchase_price`}>Purchase Price</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <div className="input-group-text">$</div>
              </div>
              <input className="form-control" id={`${this.props.mortgage.id}_purchase_price`} placeholder="500,000" value={this.props.mortgage.purchase_price || ''} onChange={this.updatePurchasePrice} />
            </div>
          </div>
          <div className="form-group col-12">
            <label className="second" htmlFor={`${this.props.mortgage.id}_down_payment`}>Down Payment</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <button className={this.downPaymentClasses('%')} onClick={this.updateDownPaymentUnitPct}>%</button>
                <button className={this.downPaymentClasses('$')} onClick={this.updateDownPaymentUnitDlr}>$</button>
              </div>
              <input className="form-control" id={`${this.props.mortgage.id}_down_payment`} placeholder="20" value={this.props.mortgage.down_payment || ''} onChange={this.updateDownPayment} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  downPaymentClasses = (symbol) => {
    return classnames('btn','btn-outline-secondary',{ active: (symbol === this.props.mortgage.down_payment_unit) })
  }
  updateMortgage = (update) => { 
    const m = this.props.mortgage.mergeDeep(update);
    const allScores = scores(m,this.props.baselineRate);
    if (allScores){
      const score = allScores[allScores.length - 1];
      update = { score, scores: allScores, grade: grade(score), ...update };
    }  
    this.props.mergeMortgages({[this.props.mortgage.id]: update }); 
  }
  
  updateRate =               (e) => { this.updateMortgage({rate: e.target.value}); }
  updatePoints =             (e) => { this.updateMortgage({points: e.target.value}); }
  updateTerm =               (e) => { this.updateMortgage({term: e.target.value}); }
  updatePurchasePrice =      (e) => { this.updateMortgage({purchase_price: e.target.value}); }
  updateDownPayment =        (e) => { this.updateMortgage({down_payment: e.target.value}); }
  updateDownPaymentUnitPct = (e) => { this.updateMortgage({down_payment_unit: '%'}); }
  updateDownPaymentUnitDlr = (e) => { this.updateMortgage({down_payment_unit: '$'}); }

}

const mstp = (state,props) => {
  return {
    baselineRate: 4.0
  }
}

const mdtp = (dispatch,props) => {
  return bindActionCreators({
    mergeMortgages: createMergeAction(props.mortgage.reducer())
  },dispatch);
};

export default connect(mstp,mdtp)(MortgagesCardForm);