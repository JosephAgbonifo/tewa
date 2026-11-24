export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string[];
  image: string;
  category: string;
  author: string;
  date: string;
  featured?: boolean;
  trending?: boolean;
  top?: boolean;
}

export interface AdSlot {
  id: string;
  image: string;
  href: string;
  label?: string;
}
