import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "react-native-config";

const API_URL = Config.API_URL;

interface User {
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;

  setToken: (token: string | null) => Promise<void>;
  setUser: (user: User | null) => void;

  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ derived state (DO NOT store separately)
  const isAuthenticated = !!token;

  const setToken = async (newToken: string | null) => {
    if (newToken) {
      await AsyncStorage.setItem("accessToken", newToken);
      setTokenState(newToken);

      try {
        const res = await axios.get(`${API_URL}/auth/profile/`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        setUserState(res.data);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        await AsyncStorage.removeItem("accessToken");
        setTokenState(null);
        setUserState(null);
      }
    } else {
      await AsyncStorage.removeItem("accessToken");
      setTokenState(null);
      setUserState(null);
    }
  };

  // ✅ convenience helper
  const logout = async () => {
    await setToken(null);
  };

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
  };

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("accessToken");
      if (storedToken) {
        await setToken(storedToken);
      }
      setLoading(false);
    };

    loadToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated, // ✅ exposed
        setToken,
        setUser,
        logout, // ✅ exposed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
