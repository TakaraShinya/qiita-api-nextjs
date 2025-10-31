export type QiitaItemResponse = {
  coediting: boolean;
  comments_count: number;
  created_at: string;
  id: string;
  likes_count: number;
  page_views_count: number;
  private: boolean;
  reactions_count: number;
  rendered_body: string;
  tags: { name: string; urlName: string }[];
  title: string;
  updated_at: string;
  url: string;
  user: {
    description: string;
    facebook_id: string;
    followees_count: number;
    followers_count: number;
    github_login_name: string;
    id: string;
    items_count: number;
    linkedin_id: string;
    location: string;
    name: string;
    organization: string;
    permanent_id: number;
    profile_image_url: string;
    team_only: boolean;
    twitter_screen_name: string;
    website_url: string;
  };
};

export type ParsedQiitaItem = {
  coediting: boolean;
  comments_count: number;
  created_at: string;
  id: string;
  likes_count: number;
  ogpImageUrl: string;
  page_views_count: number;
  private: boolean;
  reactions_count: number;
  tags: { name: string; urlName: string }[];
  title: string;
  updated_at: string;
  url: string;
  user: {
    description: string;
    facebook_id: string;
    followees_count: number;
    followers_count: number;
    github_login_name: string;
    id: string;
    name: string;
    organization: string;
    profile_image_url: string;
  };
};

export type OrgQiitaItemsResponse = {
  author: {
    name: string;
    profileImageUrl: string;
    urlName: string;
  };
  encryptedId: string;
  isLikedByViewer: boolean;
  isStockableByViewer: boolean;
  isStockedByViewer: boolean;
  likesCount: number;
  linkUrl: string;
  ogpImageUrl: string;
  organization: {
    name: string;
    urlName: string;
  };
  publishedAt: string;
  tags: { name: string; urlName: string }[];
  title: string;
  uuid: string;
};
