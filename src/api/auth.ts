import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const API_URL = Config.API_URL;
export const LOGIN_URL = `${API_URL}/auth/login/`;

export const storeTokens = async (access: string, refresh: string) => {
  await AsyncStorage.setItem('accessToken', access);
  await AsyncStorage.setItem('refreshToken', refresh);
};

export const login = async (email: string, password: string) => {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error('Server returned non-JSON response:', text);
    throw new Error('Server error: expected JSON. Check backend.');
  }

  if (!response.ok) {
    throw new Error(data.detail);
  }

  // ✅ Store tokens
  await storeTokens(data.access, data.refresh);

  // ✅ Store user for quick access if needed
  await AsyncStorage.setItem('user', JSON.stringify(data.user));

  // ✅ Return both token and user
  return { token: data.access, user: data.user };
};

export const logout = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('user');
}