import axios from 'axios';

import baseURL from '../utils/baseUrl';

const axiosObj = () =>
  axios.create({
    baseURL,
    headers: {},
  });

export const axiosPost = (url, params) =>
  new Promise((resolve, reject) => {
    axiosObj()
      .post(url, params)
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
