import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Config from "react-native-config";
import { User } from "../types/user";

const API_URL = Config.API_URL;

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

  const isAuthenticated = !!token;

  const setToken = async (newToken: string | null) => {
    if (!newToken) {
      await AsyncStorage.removeItem("accessToken");
      setTokenState(null);
      setUserState(null);
      return;
    }

    await AsyncStorage.setItem("accessToken", newToken);
    setTokenState(newToken);
  };

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove([
      'accessToken',
      'refreshToken',
      'user',
    ]);

    setTokenState(null);
    setUserState(null);
  };

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");

        if (!storedToken) {
          return;
        }

        setTokenState(storedToken);

        const res = await axios.get(`${API_URL}/auth/profile/`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        setUserState(res.data);
      } catch (err) {
        console.error("Failed to restore authentication:", err);

        await AsyncStorage.removeItem("accessToken");
        setTokenState(null);
        setUserState(null);
      } finally {
        setLoading(false);
      }
    };

    loadAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,
        setToken,
        setUser,
        logout,
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