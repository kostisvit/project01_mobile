// src/types/navigation.ts
export type RootStackParamList = {
  Welcome: undefined;
  Login?: {
    redirectTo?: keyof RootStackParamList;
    redirectParams?: any;
  };
  Signup: undefined;
  Profile: undefined;
  LocationPermission: undefined;
  Home: undefined;
  Tabs: undefined;
  Recovery: undefined;
  ResetPassword: { uid: string; token: string };
  OrgDetail: { orgId: number };
  AddReview: undefined;
  Feedback: undefined;
  EmailVerified: undefined;
  Search: undefined;
  OrgPhotos: { images: { image_url: string }[] };
};
