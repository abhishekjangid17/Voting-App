import axios, { AxiosError } from 'axios';
import { AuthResponse } from '../types';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (aadharNumber: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', { aadharNumber, password });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 401) {
      throw new Error('Invalid credentials');
    }
    throw new Error('Login failed. Please try again.');
  }
};

export const register = async (aadharNumber: string, password: string): Promise<void> => {
  try {
    await api.post('/auth/register', { aadharNumber, password });
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 409) {
      throw new Error('Aadhar number already registered');
    }
    throw new Error('Registration failed. Please try again.');
  }
};

export const getCandidates = async () => {
  const response = await api.get('/candidates');
  return response.data;
};

export const voteForCandidate = async (candidateId: string) => {
  const response = await api.post(`/vote/${candidateId}`);
  return response.data;
};

export const addCandidate = async (name: string, party: string) => {
  const response = await api.post('/candidates', { name, party });
  return response.data;
};

export const updateCandidate = async (id: string, name: string, party: string) => {
  const response = await api.put(`/candidates/${id}`, { name, party });
  return response.data;
};

export const deleteCandidate = async (id: string) => {
  const response = await api.delete(`/candidates/${id}`);
  return response.data;
};