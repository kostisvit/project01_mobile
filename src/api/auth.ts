// auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

const API_URL = Config.API_URL;

export const LOGIN_URL = `${API_URL}/login/`;
export const REFRESH_URL = `${API_URL}/token/refresh/`;

// -----------------------
// Token Storage Helpers
// -----------------------
export const storeTokens = async (access: string, refresh: string) => {
  await AsyncStorage.setItem('accessToken', access);
  await AsyncStorage.setItem('refreshToken', refresh);
};

export const getAccessToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('accessToken');
};

export const getRefreshToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('refreshToken');
};

export const clearTokens = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('user');
};

export const logout = async () => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('user');
};

// -----------------------
// Login Function
// -----------------------
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text(); // raw response

    let data;
    try {
      data = JSON.parse(text); // parse JSON
    } catch {
      console.error('Server returned non-JSON response:', text);
      throw new Error('Server error: expected JSON. Check backend.');
    }

    if (!response.ok) {
      throw new Error(data.detail || 'Login failed');
    }

    // Store tokens and user info
    await storeTokens(data.access, data.refresh);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    return data.user;
  } catch (err: any) {
    console.error('Login error:', err);
    throw new Error(err.message || 'Login failed');
  }
};

// -----------------------
// Refresh Access Token
// -----------------------
export const refreshAccessToken = async (): Promise<boolean> => {
  const refresh = await getRefreshToken();
  if (!refresh) return false;

  try {
    const response = await fetch(REFRESH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Refresh token response not JSON:', text);
      return false;
    }

    if (!response.ok) return false;

    await storeTokens(data.access, refresh); // keep same refresh token
    return true;
  } catch (err) {
    console.error('Refresh token error:', err);
    return false;
  }
};

// -----------------------
// Fetch Helper with JWT
// -----------------------
export const fetchWithToken = async (endpoint: string, options: any = {}) => {
  let token = await getAccessToken();

  const headers: any = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  let response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
    ...options,
    headers,
  });

  // If 401, try refreshing token
  if (response.status === 401) {
    console.log('Access token expired, trying refresh...');
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = await getAccessToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
      response = await fetch(`http://127.0.0.1:8000${endpoint}`, { ...options, headers });
    } else {
      console.log('Refresh failed. Logging out.');
      await AsyncStorage.clear();
      throw new Error('Session expired. Please login again.');
    }
  }

  // Parse JSON safely
  const text = await response.text();
  try {
    const data = JSON.parse(text);
    return { status: response.status, data };
  } catch {
    console.warn('Non-JSON response:', text);
    return { status: response.status, data: text };
  }
};