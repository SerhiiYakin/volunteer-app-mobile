import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.0.37:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
