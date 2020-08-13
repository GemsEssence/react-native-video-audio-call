import {axiosPost} from '../axiosConfig';

export const startCall = (params) => () => {
  return axiosPost('/calls/start_call', params)
    .then((res) => {
      console.log('success', res);
      return true;
    })
    .catch((err) => {
      console.log('error', err);
      return false;
    });
};

export const missedCallNotify = (params) => () => {
  return axiosPost('/calls/missed_call', params)
    .then((res) => {
      console.log('success', res);
      return true;
    })
    .catch((err) => {
      console.log('error', err);
      return false;
    });
};
