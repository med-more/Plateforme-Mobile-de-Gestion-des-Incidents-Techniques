import axios from 'axios';
import { getToken } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';  

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
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

export const updateUserProfile = async (userId, userData, token) => {
  try {
    const response = await axios.put(`${API_URL}/auth/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/auth/verify-email/${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyPhone = async (phone, code) => {
  try {
    const response = await axios.post(`${API_URL}/auth/verify-phone`, { phone, code });
    return response.data;
  } catch (error) {
    throw error;
  }
};
