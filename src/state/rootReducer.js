import {combineReducer} from 'react-redux';

import Users from './Users/reducer';

const rootReducer = combineReducer({
  Users,
});

export default rootReducer;
