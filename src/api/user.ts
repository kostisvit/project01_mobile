import { api } from "./client";
import { UserProfile } from "../types/user";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("auth/profile/");
  return response.data;
};

export const updateProfile = async (
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>("auth/profile/", data);
  return response.data;
};
