import axios from 'axios';

const BASE_URL = import.meta.env.VITE_HOST!;

export const publicAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const privateAxios = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

privateAxios.interceptors.request.use(
  (config) => {
    if (!config.headers['authorization']) {
      config.headers['authorization'] =
        `Bearer ${localStorage.getItem('token')}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
