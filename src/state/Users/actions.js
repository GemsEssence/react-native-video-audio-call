import {LOGIN, LOGOUT} from '../types';

export const loginDetails = (data) => ({
  type: LOGIN,
  data,
});

export const logout = () => ({
  type: LOGOUT,
});
