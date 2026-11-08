import { api } from "./client";
import { User,UserProfile } from "../types/user";

export const getProfile = async (): Promise<User> => {
  const response = await api.get<User>("api/accounts/profile/");
  return response.data;
};

export const updateProfile = async (
  data: { profile: Partial<UserProfile> }
): Promise<User> => {
  const response = await api.patch<User>(
    "api/accounts/profile/",
    data
  );
  return response.data;
};
