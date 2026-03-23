export type OrganizationImage = { image_url: string; };

export type OrganizationReview = {
  id: number;
  rating: number;
  comment: string;
  created: string;
  user_name?: string; // if you send it
  replies?: OrganizationReviewReply[];
};

export type OrganizationReviewReply = {
  id: number;
  comment: string;
  created: string;
  user_name?: string; // if you send it
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

};

export type OrgCardProps = {
  org: any; // replace with proper type if you have one
  width: number;
};
