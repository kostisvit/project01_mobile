import { api } from "./client";
import { UserProfile } from "../types/user";

export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("profile/");
  return response.data;
};

export const updateProfile = async (
  data: Partial<UserProfile>
): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>("profile/", data);
  return response.data;
};
