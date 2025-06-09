import axios from 'axios';

const API_BASE_URL = 'http://10.0.0.37:8080'; // ← твій IP

export const login = (email, password) => {
  return axios.post(`${API_BASE_URL}/auth/login`,
    { email, password },
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }
  );
};

export const getUser = () => {
  return axios.get(`${API_BASE_URL}/auth/check-auth`, {
    withCredentials: true
  });
};

export const logout = () => {
  return axios.post(`${API_BASE_URL}/auth/logout`, {}, {
    withCredentials: true
  });
};
