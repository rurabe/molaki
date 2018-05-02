'use strict';
const { Record,Map } = require('immutable');

module.exports = class Mortgage extends Record({
  id: undefined,
  term: 360,
  rate: undefined,
  points: undefined,
  purchase_price: undefined,
  down_payment: 20,
  down_payment_unit: '%',
  fees: Map({}),
  credits: Map({}),
  lender: undefined,
  score: undefined,
  created_at: undefined,
  score: undefined,
  scores: undefined,
  grade: undefined
}) {
  reducer(){
    return this.created_at ? 'mortgages' : 'unsaved_mortgages'
  }


};