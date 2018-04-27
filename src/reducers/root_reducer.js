import { createStandardReducer } from 'standard-reducer';

import Mortgage from '../models/mortgage';

window.Mortgage = Mortgage

const RootReducer = {
  mortgages:         createStandardReducer('mortgages'),
  unsaved_mortgages: createStandardReducer('unsaved_mortgages'),
};

export default RootReducer;