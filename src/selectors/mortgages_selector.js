'use strict';

import { createSelector } from 'reselect';

const getMortgages = state => state.get('mortgages');
const getUnsavedMortgages = state => state.get('unsaved_mortgages');

export default createSelector(
  getMortgages,
  getUnsavedMortgages,
  (mortgages,unsavedMortgages) => {
    console.log("reselect")
    return mortgages.merge(unsavedMortgages).sortBy(m => -1 * m.score).toIndexedSeq();
  }
);