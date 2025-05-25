import axios from 'axios';
import { getToken } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';  

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data; 
};

export const registerUser = async (formData) => {
  const response = await axios.post(`${API_URL}/auth/register`, formData);
  return response.data;
};

export const getUserProfile = async () => {
  const token = await getToken();

  const response = await axios.get(`${API_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateUserProfile = async (formData) => {
  const token = await getToken();

  const response = await axios.put(`${API_URL}/user/profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
