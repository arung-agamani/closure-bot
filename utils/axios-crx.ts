/* eslint-disable no-console */
import axios, { AxiosResponse } from 'axios';

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:2000/api/'
      : 'https://closure.howlingmoon.dev/api/',
  headers: {
    'X-Closure-Source': 'crx',
  },
});

instance.interceptors.request.use(
  (config) => {
    console.log(`[AXIOS] request sent to ${config.url}`);
    return config;
  },
  (err: AxiosResponse) => {
    console.log(`[AXIOS] request error: ${JSON.stringify(err.statusText)}`);
    return Promise.reject(err);
  }
);

export default instance;
