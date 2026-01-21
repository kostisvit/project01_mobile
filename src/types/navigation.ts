// src/types/navigation.ts
export type RootStackParamList = {
  Welcome: undefined;
  Login?: {
    redirectTo?: keyof RootStackParamList;
    redirectParams?: any;
  };
  Signup: undefined;
  Profile: undefined;
  Home: undefined;
  Tabs: undefined;
  OrgDetail: { orgId: number };
};
