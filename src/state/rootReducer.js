import {combineReducers} from 'redux';

import Users from './Users/reducer';

const rootReducer = combineReducers({
  Users,
});

export default rootReducer;
