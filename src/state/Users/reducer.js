import {isEqual} from 'lodash';

import {LOGIN, LOGOUT} from '../types';

const initialState = {
  currentUser: {},
  isAdmin: false,
};

const UsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        currentUser: action.data,
        isAdmin: isEqual(action.data.mobile, '7566881369'),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default UsersReducer;
