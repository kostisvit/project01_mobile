import { api } from "./client";
import { User } from "../types/user";

export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>("api/auth/profile/");
  return response.data;
};

export const updateProfile = async (
  data: Partial<User>
): Promise<User> => {
  const response = await api.patch<User>("api/auth/profile/", data);
  return response.data;
};
