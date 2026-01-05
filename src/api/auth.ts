// src/api/auth.ts
import axios from 'axios';

export interface LoginResponse {
  access: string;
  refresh: string;
}

const API_URL = 'http://127.0.0.1:8000/api';
export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/token/`, {
    username,
    password,
  });

  return {
    access: response.data.access,
    refresh: response.data.refresh,
  };
};
