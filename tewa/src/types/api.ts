export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  posts_count?: number;
}

export interface ApiPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  image: string | null;
  category: {
    id: number;
    name: string;
    slug: string;
  } | null;
  author: string | null;
  is_top: boolean;
  is_trending: boolean;
  is_featured: boolean;
  views_count: number;
  published_at: string | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

export interface LoginResponse {
  user: { id: number; name: string; email: string };
  token: string;
}

export interface InterviewQuestion {
  n: number;
  text: string;
  private: boolean;
  required: boolean;
}

export interface InterviewChapter {
  key: string;
  title: string;
  blurb: string;
  starred: boolean;
  short?: boolean;
  cheer?: string | null;
  questions: InterviewQuestion[];
}

export interface InterviewSignoff {
  cover_name?: string | null;
  signature?: string | null;
  contact?: string | null;
  date?: string | null;
  consents?: boolean[];
}

export interface InterviewData {
  locked: boolean;
  status: string;
  min_photos?: number;
  max_photos?: number;
  name: string;
  welcome?: {
    lede: string;
    minutes: string;
    greeting: string;
    letter: string;
    steps: string[];
  };
  email_extras?: string[];
  editor_email?: string;
  declarations?: string[];
  chapters?: InterviewChapter[];
  answers?: Record<string, string>;
  signoff?: InterviewSignoff;
  photo_credit?: string | null;
  images?: string[];
  change_note?: string | null;
  preview?: FeaturedProfile;
}

export interface AdminFeatured {
  id: number;
  name: string | null;
  email: string | null;
  status: string;
  interview_url: string | null;
  image: string | null;
  is_current: boolean;
  submitted_at: string | null;
  created_at: string;
}
export interface FeaturedPerson {
  id: number;
  slug: string;
  name: string;
  titles: string[];
  tagline: string | null;
  location: string | null;
  social_url: string | null;
  images: string[];
  created_at: string;
}

export interface ProfileChapter {
  key: string;
  title: string;
  blurb?: string;
  items: { n: number; question: string; answer: string }[];
}

export interface FeaturedProfile {
  id: number;
  slug: string;
  name: string;
  titles: string[];
  tagline: string | null;
  location: string | null;
  social_url: string | null;
  photo_credit: string | null;
  images: string[];
  chapters: ProfileChapter[];
}

export interface AdminFeaturedDetail {
  id: number;
  status: string;
  name: string | null;
  email: string | null;
  slug: string;
  interview_url: string | null;
  titles: string[];
  social_url: string | null;
  tagline: string | null;
  location: string | null;
  photo_credit: string | null;
  images: string[];
  originals: string[];
  answers: Record<string, string>;
  public_answers: number[];
  signoff: InterviewSignoff;
  change_note: string | null;
  submitted_at: string | null;
  confirmed_at: string | null;
  chapters: InterviewChapter[];
  profile: FeaturedProfile;
}
