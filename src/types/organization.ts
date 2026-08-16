export type OrganizationImage = { image_url: string; };

export type OrganizationReview = {
  id: number;
  rating: number;
  comment: string;
  created: string;
  user_name?: string;
  replies?: OrganizationReviewReply[];
};

export type OrganizationReviewReply = {
  id: number;
  comment: string;
  created: string;
  user_name?: string;
};

type StatusInfo = {
  is_open: boolean;
};

export type Organization = {
  id: number;
  name: string;
  phone: string;
  address: string;
  description?: string;
  email?: string;
  reviews: OrganizationReview[];
  latitude: number;
  longitude: number;
  image_url: OrganizationImage[];
  average_rating?: number;
  open_status?: string;
  images: OrganizationImage[];
  status_info?: StatusInfo;
  hours?: OrgHour[];
  organization_type?: OrgType;
  is_verified?:boolean;
};

export type OrgCardProps = {
  org: any;
  width: number;
};

export type OrgHour = {
  id: string;
  day: string;
  open: string;
  close?: string | null;
};

export type Props = {
  organizations: Organization[];
};

export type OrgType = {
  id: number;
  name: string;
  icon: string;
  slug: string;
};
