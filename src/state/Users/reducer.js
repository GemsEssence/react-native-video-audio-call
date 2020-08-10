import {LOGIN, LOGOUT} from '../types';

const initialState = {
  currentUser: {},
};

const UsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        currentUser: action.data,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default UsersReducer;
