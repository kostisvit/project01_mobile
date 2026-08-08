import Config from 'react-native-config';

const API_URL = Config.API_URL;
export const LOGIN_URL = `${API_URL}/auth/login/`;

export const login = async (email: string, password: string) => {
  const response = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
    }),
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
    throw new Error(
      data?.detail ||
      data?.message ||
      'Login failed'
    );
  }

  return {
    token: data.access,
    refreshToken: data.refresh,
    user: data.user,
  };
};