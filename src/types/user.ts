export interface UserProfile {
  first_name: string;
  last_name: string;
  phone: string;
}

export interface User {
  id: number;
  profile: UserProfile;

}

